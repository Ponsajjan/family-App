import React, { useState, useEffect } from 'react';
import { CloseIcon, ResetData } from '@/utils/Icons';
import { appFetch } from '@/utils/appFetch';
import { ButtonSolid } from '@/components/Button';
import FilterSelect from '@/components/FilterSelect';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      occupation: '',
      education: '',
      birthPlace: '',
      country: '',
      state: '',
      city: ''
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
        <FilterSelect
          className="mb-4"
          label="Occupation"
          name="occupation"
          value={filters.occupation}
          options={options.occupations}
          onChange={handleChange}
        />
        <FilterSelect
          className="mb-4"
          label="Education"
          name="education"
          value={filters.education}
          options={options.educations}
          onChange={handleChange}
        />
        <FilterSelect
          className="mb-6"
          label="Birth Place"
          name="birthPlace"
          value={filters.birthPlace}
          options={options.birthPlaces}
          onChange={handleChange}
        />
        <hr className="border-t border-border_color block mb-4" />
        <FilterSelect
          className="mb-4"
          label="Country"
          name="country"
          value={filters.country}
          options={options.countries}
          onChange={handleChange}
        />
        <FilterSelect
          className="mb-4"
          label="State"
          name="state"
          value={filters.state}
          options={options.states}
          onChange={handleChange}
          disabled={!filters.country}
        />
        <FilterSelect
          className="mb-4"
          label="City"
          name="city"
          value={filters.city}
          options={options.cities}
          onChange={handleChange}
          disabled={!filters.state}
        />
        <ButtonSolid
          onClick={Object.values(filters).some(v => v !== '') || Object.values(currentFilters).some(v => v !== '') ? handleApply : onClose}
          buttonText={Object.values(filters).some(v => v !== '') || Object.values(currentFilters).some(v => v !== '') ? "Apply Filters" : "Cancel"}
          className='w-full mt-4'
        />
      </div>
    </>
  );
}
