import React, { useState, useEffect } from 'react';
import { CloseIcon, ResetData, Info } from '@/utils/Icons';
import { appFetch } from '@/utils/appFetch';
import { ButtonSolid } from '@/components/Button';
import FilterSelect from '@/components/FilterSelect';
import MultiSelectPopup from '@/components/MultiSelectPopup';
import SingleSelectPopup from '@/components/SingleSelectPopup';
import Input from '@/components/Input';

interface FilterPanelProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

export default function FilterPanel({ onClose, onApply, currentFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState(currentFilters);
  const [options, setOptions] = useState<{
    occupations: string[],
    educations: string[],
    birthPlaces: string[],
    countries: string[],
    states: string[],
    cities: string[]
  }>({
    occupations: [],
    educations: [],
    birthPlaces: [],
    countries: [],
    states: [],
    cities: []
  });

  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const res = await appFetch('/api/relatives/filterOptions');
        if (res.ok) {
          const data = await res.json();
          setOptions(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch filter options", err);
      }
    };
    fetchInitialOptions();
  }, []);

  useEffect(() => {
    if (filters.country) {
      const fetchStates = async () => {
        try {
          const res = await appFetch(`/api/relatives/filterOptions?type=states&country=${encodeURIComponent(filters.country)}`);
          if (res.ok) {
            const { data } = await res.json();
            setOptions(prev => ({ ...prev, states: data }));
          }
        } catch (err) {
          console.error("Failed to fetch states", err);
        }
      };
      fetchStates();
    } else {
      setOptions(prev => ({ ...prev, states: [], cities: [] }));
    }
  }, [filters.country]);

  useEffect(() => {
    if (filters.country && filters.state) {
      const fetchCities = async () => {
        try {
          const res = await appFetch(`/api/relatives/filterOptions?type=cities&country=${encodeURIComponent(filters.country)}&state=${encodeURIComponent(filters.state)}`);
          if (res.ok) {
            const { data } = await res.json();
            setOptions(prev => ({ ...prev, cities: data }));
          }
        } catch (err) {
          console.error("Failed to fetch cities", err);
        }
      };
      fetchCities();
    } else {
      setOptions(prev => ({ ...prev, cities: [] }));
    }
  }, [filters.country, filters.state]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev: any) => {
      const newFilters = { ...prev, [name]: value };
      if (name === 'country') {
        newFilters.state = '';
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
          <h2 className="text-xl font-semibold underline decoration-border_active underline-offset-4">Add Search Filters</h2>
          <button onClick={handleReset} title="Reset Filters" className="p-1 hover:bg-field_color rounded-md">
            <ResetData />
          </button>
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 hover:bg-field_color border border-border_color rounded-md m-2">
          <CloseIcon />
        </button>
      </div>
      <div className='px-4 pb-6 pt-2'>
        <MultiSelectPopup
          className="mb-4"
          label="Occupation"
          values={filters.occupation || []}
          options={options.occupations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, occupation: values }))}
        />
        <MultiSelectPopup
          className="mb-4"
          label="Education"
          values={filters.education || []}
          options={options.educations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, education: values }))}
        />
        <MultiSelectPopup
          className="mb-6"
          label="Birth Place"
          values={filters.birthPlace || []}
          options={options.birthPlaces}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, birthPlace: values }))}
        />
        <hr className="border-t border-border_color block mb-4" />
        <SingleSelectPopup
          className="mb-4"
          label="Country"
          value={filters.country}
          options={options.countries}
          onChange={(val) => handleChange({ target: { name: 'country', value: val } } as any)}
        />
        <SingleSelectPopup
          className="mb-4"
          label="State"
          value={filters.state}
          options={options.states}
          onChange={(val) => handleChange({ target: { name: 'state', value: val } } as any)}
          disabled={!filters.country}
        />
        <SingleSelectPopup
          className="mb-6"
          label="City"
          value={filters.city}
          options={options.cities}
          onChange={(val) => handleChange({ target: { name: 'city', value: val } } as any)}
          disabled={!filters.state}
        />
        <hr className="border-t border-border_color block mb-4" />
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Born Between</label>
          <div className="flex gap-2 items-center w-full">
            <Input
              type="number"
              placeholder="YYYY"
              name="birthYearStart"
              value={filters.birthYearStart || ''}
              onChange={handleChange}
              min="1600"
              max={new Date().getFullYear()}
              maxLength={4}
              label=""
            />
            <span className="opacity-50">-</span>
            <Input
              type="number"
              placeholder="YYYY"
              name="birthYearEnd"
              value={filters.birthYearEnd || ''}
              onChange={handleChange}
              min="1600"
              max={new Date().getFullYear()}
              maxLength={4}
              label=""
            />
          </div>
          <div className="text-xs text-text_color/60 mt-2 flex items-center gap-1 p-2 bg-field_color rounded-md">
            <span className="mt-0.5"><Info /></span>
            <span>This will only filter for members with a birth year assigned.</span>
          </div>
        </div>
        <ButtonSolid
          onClick={Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') || Object.values(currentFilters).some(v => Array.isArray(v) ? (v as string[]).length > 0 : v !== '') ? handleApply : onClose}
          buttonText={Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== '') || Object.values(currentFilters).some(v => Array.isArray(v) ? (v as string[]).length > 0 : v !== '') ? "Apply Filters" : "Cancel"}
          className='w-full mt-4'
        />
      </div>
    </>
  );
}
