import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon, ResetData, Info } from '@/utils/Icons';
import { appFetch } from '@/utils/appFetch';
import { ButtonSolid } from '@/components/Button';
import MultiSelectPopup from '@/components/MultiSelectPopup';
import SingleSelectPopup from '@/components/SingleSelectPopup';
import Input from '@/components/Input';

interface FilterPanelProps {
  showFilters: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

export default function FilterPanel({ showFilters, onClose, onApply, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState(currentFilters);
  const [options, setOptions] = useState<{
    occupations: string[],
    educations: string[],
    birthPlaces: string[],
    countries: string[],
    states: string[],
    districts: string[],
    cities: string[]
  }>({
    occupations: [],
    educations: [],
    birthPlaces: [],
    countries: [],
    states: [],
    districts: [],
    cities: []
  });

  const [allLocations, setAllLocations] = useState<{
    districts: { name: string; state: string }[];
    cities: { name: string; state: string; district: string }[];
  }>({ districts: [], cities: [] });

  const [loadingFields, setLoadingFields] = useState<{
    initial: boolean;
    states: boolean;
  }>({
    initial: true,
    states: false,
  });

  // Sync filters with currentFilters when the panel becomes visible
  useEffect(() => {
    if (showFilters) {
      setFilters(currentFilters);
    }
  }, [showFilters, currentFilters]);

  useEffect(() => {
    if (!showFilters) return;
    const fetchInitialOptions = async () => {
      try {
        setLoadingFields(prev => ({ ...prev, initial: true }));
        const res = await appFetch('/api/relatives/filterOptions?excludeLocations=true');
        if (res.ok) {
          const data = await res.json();
          setOptions(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch filter options", err);
      } finally {
        setLoadingFields(prev => ({ ...prev, initial: false }));
      }
    };
    fetchInitialOptions();
  }, [showFilters]);

  useEffect(() => {
    if (!showFilters || !filters.country) {
      setOptions(prev => ({ ...prev, states: [] }));
      setAllLocations({ districts: [], cities: [] });
      return;
    }
    const fetchLocations = async () => {
      try {
        setLoadingFields(prev => ({ ...prev, states: true }));
        const res = await appFetch(`/api/relatives/filterOptions?type=locations&country=${encodeURIComponent(filters.country)}`);
        if (res.ok) {
          const { states, districts, cities } = await res.json();
          setOptions(prev => ({ ...prev, states }));
          setAllLocations({ districts, cities });
        }
      } catch (err) {
        console.error("Failed to fetch location options", err);
      } finally {
        setLoadingFields(prev => ({ ...prev, states: false }));
      }
    };
    fetchLocations();
  }, [showFilters, filters.country]);

  // Derives the district list from the full country dataset.
  // When no state is selected: deduplicates all district names across states.
  // When a state is selected: narrows to districts belonging to that state only.
  const displayDistricts = useMemo(() => {
    if (!filters.state)
      return [...new Set(allLocations.districts.map(d => d.name))].sort((a, b) => a.localeCompare(b));
    return [...new Set(
      allLocations.districts
        .filter(d => d.state.toLowerCase() === filters.state.toLowerCase())
        .map(d => d.name)
    )].sort((a, b) => a.localeCompare(b));
  }, [allLocations.districts, filters.state]);

  // Derives the city list from the full country dataset.
  // Narrows by state if selected, then further narrows by district if selected.
  // Uses Set to deduplicate city names that may appear across multiple state/district combos.
  const displayCities = useMemo(() => {
    return [...new Set(
      allLocations.cities
        .filter(c => {
          if (filters.state && c.state.toLowerCase() !== filters.state.toLowerCase()) return false;
          if (filters.district && c.district.toLowerCase() !== filters.district.toLowerCase()) return false;
          return true;
        })
        .map(c => c.name)
    )].sort((a, b) => a.localeCompare(b));
  }, [allLocations.cities, filters.state, filters.district]);

  // Auto-clear district when the selected district no longer exists in the computed list
  // (e.g. user picks a state that doesn't contain the previously selected district).
  useEffect(() => {
    if (!showFilters) return;
    if (filters.district && !displayDistricts.includes(filters.district)) {
      setFilters((prev: any) => ({ ...prev, district: '' }));
    }
  }, [showFilters, displayDistricts, filters.district]);

  // Auto-clear city when the selected city no longer exists in the computed list
  // (e.g. user changes state or district making the current city invalid).
  useEffect(() => {
    if (!showFilters) return;
    if (filters.city && !displayCities.includes(filters.city)) {
      setFilters((prev: any) => ({ ...prev, city: '' }));
    }
  }, [showFilters, displayCities, filters.city]);

  if (!showFilters) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => {
      if (prev[name] === value) return prev;
      const newFilters = { ...prev, [name]: value };
      if (name === 'country') {
        newFilters.state = '';
        newFilters.district = '';
        newFilters.city = '';
      }
      if (name === 'state') {
        newFilters.city = '';
      }
      return newFilters;
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const reset = {
      occupation: [],
      education: [],
      birthPlace: [],
      country: '',
      state: '',
      district: '',
      city: '',
      birthYearStart: '',
      birthYearEnd: ''
    };
    setFilters(reset);
    onApply(reset);
    onClose();
  };

  return (
    <>
      <div className="p-4 z-20 sticky top-0 flex justify-between items-center bg-main_background border-b border-border_color">
        <div className="flex gap-2 items-center">
          <h2 id="filter-panel-title" className="text-xl font-semibold underline decoration-border_active underline-offset-4">Add Search Filters</h2>
          <button onClick={handleReset} title="Reset Filters" aria-label="Reset all filters" className="p-1 hover:bg-field_color rounded-md">
            <ResetData aria-hidden="true" />
          </button>
        </div>
        <button onClick={onClose} aria-label="Close filter panel" className="absolute top-4 right-3 hover:bg-field_color border border-border_color rounded-md cursor-pointer z-20">
          <CloseIcon aria-hidden="true" />
        </button>
      </div>
      <div className='px-4 pb-6 pt-2'>
        <MultiSelectPopup
          className="mb-4"
          label="Occupation"
          values={filters.occupation || []}
          options={options.occupations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, occupation: values }))}
          loading={loadingFields.initial}
        />
        <MultiSelectPopup
          className="mb-4"
          label="Education"
          values={filters.education || []}
          options={options.educations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, education: values }))}
          loading={loadingFields.initial}
        />
        <MultiSelectPopup
          className="mb-6"
          label="Birth Place"
          values={filters.birthPlace || []}
          options={options.birthPlaces}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, birthPlace: values }))}
          loading={loadingFields.initial}
        />
        <hr className="border-t border-border_color block mb-4" />
        <SingleSelectPopup
          className="mb-4"
          label="Country"
          value={filters.country}
          options={options.countries}
          onChange={(val) => handleChange({ target: { name: 'country', value: val } } as any)}
          loading={loadingFields.initial}
        />
        <SingleSelectPopup
          className="mb-4"
          label="State/Region"
          placeholder="All States/Regions"
          value={filters.state}
          options={options.states}
          onChange={(val) => handleChange({ target: { name: 'state', value: val } } as any)}
          disabled={!filters.country}
          loading={loadingFields.states}
        />
        <SingleSelectPopup
          className="mb-4"
          label="District"
          placeholder="All Districts"
          value={filters.district}
          options={displayDistricts}
          onChange={(val) => handleChange({ target: { name: 'district', value: val } } as any)}
          disabled={!filters.country}
          loading={loadingFields.states}
        />
        <SingleSelectPopup
          className="mb-6"
          label="City/Locality"
          placeholder="All Cities/Localities"
          value={filters.city}
          options={displayCities}
          onChange={(val) => handleChange({ target: { name: 'city', value: val } } as any)}
          disabled={!filters.country}
          loading={loadingFields.states}
        />
        <hr className="border-t border-border_color block mb-4" />
        <div className="mb-6">
          <p id="born-between-label" className="text-sm font-medium mb-2 block">Born Between</p>
          <div role="group" aria-labelledby="born-between-label" className="flex gap-2 items-center w-full">
            <Input
              type="number"
              placeholder="YYYY"
              name="birthYearStart"
              aria-label="Birth year start"
              value={filters.birthYearStart || ''}
              onChange={handleChange}
              min="1600"
              max={new Date().getFullYear()}
              maxLength={4}
              label=""
            />
            <span className="opacity-50" aria-hidden="true">-</span>
            <Input
              type="number"
              placeholder="YYYY"
              name="birthYearEnd"
              aria-label="Birth year end"
              value={filters.birthYearEnd || ''}
              onChange={handleChange}
              min="1600"
              max={new Date().getFullYear()}
              maxLength={4}
              label=""
            />
          </div>
          <div className="text-xs text-text_color/60 mt-4 flex items-center gap-1 p-2 bg-field_color rounded-md" role="note">
            <span className="mt-0.5" aria-hidden="true"><Info /></span>
            <span>Members missing any of the selected filter fields are excluded.</span>
          </div>
          <ButtonSolid
            onClick={Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') || Object.values(currentFilters).some(v => Array.isArray(v) ? (v as string[]).length > 0 : v !== '') ? handleApply : onClose}
            buttonText={Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') || Object.values(currentFilters).some(v => Array.isArray(v) ? (v as string[]).length > 0 : v !== '') ? "Apply Filters" : "Cancel"}
            className='w-full mt-4'
          />
        </div>
      </div>
    </>
  );
}
