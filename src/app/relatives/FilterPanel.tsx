import React, { useState, useEffect, useCallback } from 'react';
import { CloseIcon, ResetData, Info, WarningCircle, RefreshIcon } from '@/utils/Icons';
import { appFetch } from '@/utils/appFetch';
import { useDebounce } from '@/utils/debounce';
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

type PaginatedFieldKey = 'occupation' | 'education' | 'birthPlace' | 'country' | 'state' | 'district' | 'city';
type LocationFieldKey = 'state' | 'district' | 'city';

const LOCATION_FIELD_KEYS: LocationFieldKey[] = ['state', 'district', 'city'];

const FIELD_TO_OPTIONS_KEY: Record<PaginatedFieldKey, 'occupations' | 'educations' | 'birthPlaces' | 'countries' | 'states' | 'districts' | 'cities'> = {
  occupation: 'occupations',
  education: 'educations',
  birthPlace: 'birthPlaces',
  country: 'countries',
  state: 'states',
  district: 'districts',
  city: 'cities',
};

interface FieldMetaEntry {
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  search: string;
  error: boolean;
  lastAttempt: { skip: number; search: string; append: boolean } | null;
}

const EMPTY_FIELD_META: FieldMetaEntry = { hasMore: false, loading: false, loadingMore: false, search: '', error: false, lastAttempt: null };

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

  const [loadingFields, setLoadingFields] = useState<{ initial: boolean }>({
    initial: true,
  });

  const [errors, setErrors] = useState<{ initial: boolean }>({
    initial: false,
  });

  // Per-field pagination/search state for the Occupation, Education, Birth Place, Country,
  // State, District and City popups.
  const [fieldMeta, setFieldMeta] = useState<Record<PaginatedFieldKey, FieldMetaEntry>>({
    occupation: EMPTY_FIELD_META,
    education: EMPTY_FIELD_META,
    birthPlace: EMPTY_FIELD_META,
    country: EMPTY_FIELD_META,
    state: EMPTY_FIELD_META,
    district: EMPTY_FIELD_META,
    city: EMPTY_FIELD_META,
  });

  const locationsError = fieldMeta.state.error || fieldMeta.district.error || fieldMeta.city.error;

  // Sync filters with currentFilters when the panel becomes visible
  useEffect(() => {
    if (showFilters) {
      setFilters(currentFilters);
    }
  }, [showFilters, currentFilters]);

  const fetchInitialOptions = useCallback(async () => {
    try {
      setLoadingFields(prev => ({ ...prev, initial: true }));
      setErrors(prev => ({ ...prev, initial: false }));
      const res = await appFetch('/api/relatives/filterOptions?excludeLocations=true');
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();
      setOptions(prev => ({ ...prev, ...data }));
      setFieldMeta(prev => ({
        ...prev,
        occupation: { ...EMPTY_FIELD_META, hasMore: !!data.occupationsHasMore },
        education: { ...EMPTY_FIELD_META, hasMore: !!data.educationsHasMore },
        birthPlace: { ...EMPTY_FIELD_META, hasMore: !!data.birthPlacesHasMore },
        country: { ...EMPTY_FIELD_META, hasMore: !!data.countriesHasMore },
      }));
    } catch (err) {
      console.error("Failed to fetch filter options", err);
      setErrors(prev => ({ ...prev, initial: true }));
    } finally {
      setLoadingFields(prev => ({ ...prev, initial: false }));
    }
  }, []);

  useEffect(() => {
    if (!showFilters) return;
    fetchInitialOptions();
  }, [showFilters, fetchInitialOptions]);

  // Fetches a page of options for a single paginated field (initial search, or "load more").
  // For state/district/city, results are cascaded by the currently selected country/state/district.
  const fetchFieldOptions = async (
    field: PaginatedFieldKey,
    opts: { skip: number; search: string; append: boolean }
  ) => {
    const isInitialFetch = opts.skip === 0 && !opts.append;
    setFieldMeta(prev => ({
      ...prev,
      [field]: { ...prev[field], loading: isInitialFetch, loadingMore: !isInitialFetch, error: false, lastAttempt: opts },
    }));
    try {
      const params = new URLSearchParams({ type: 'fieldOptions', field, skip: String(opts.skip), take: '25' });
      if (opts.search) params.set('search', opts.search);
      if (LOCATION_FIELD_KEYS.includes(field as LocationFieldKey)) {
        params.set('country', filters.country || '');
        if ((field === 'district' || field === 'city') && filters.state) params.set('state', filters.state);
        if (field === 'city' && filters.district) params.set('district', filters.district);
      }
      const res = await appFetch(`/api/relatives/filterOptions?${params.toString()}`);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const { data, hasMore } = await res.json();
      const optionsKey = FIELD_TO_OPTIONS_KEY[field];
      setOptions(prev => ({
        ...prev,
        [optionsKey]: opts.append ? [...prev[optionsKey], ...data] : data,
      }));
      setFieldMeta(prev => ({ ...prev, [field]: { ...prev[field], hasMore, loading: false, loadingMore: false, error: false } }));
    } catch (err) {
      console.error(`Failed to fetch ${field} options`, err);
      setFieldMeta(prev => ({ ...prev, [field]: { ...prev[field], loading: false, loadingMore: false, error: true } }));
    }
  };

  const handleLoadMore = (field: PaginatedFieldKey) => {
    const meta = fieldMeta[field];
    if (meta.loadingMore) return;
    if (meta.error && meta.lastAttempt) {
      fetchFieldOptions(field, meta.lastAttempt);
      return;
    }
    if (!meta.hasMore) return;
    fetchFieldOptions(field, { skip: options[FIELD_TO_OPTIONS_KEY[field]].length, search: meta.search, append: true });
  };

  const debouncedOccupationSearch = useDebounce((value: string) => fetchFieldOptions('occupation', { skip: 0, search: value, append: false }), 400);
  const debouncedEducationSearch = useDebounce((value: string) => fetchFieldOptions('education', { skip: 0, search: value, append: false }), 400);
  const debouncedBirthPlaceSearch = useDebounce((value: string) => fetchFieldOptions('birthPlace', { skip: 0, search: value, append: false }), 400);
  const debouncedCountrySearch = useDebounce((value: string) => fetchFieldOptions('country', { skip: 0, search: value, append: false }), 400);
  const debouncedStateSearch = useDebounce((value: string) => fetchFieldOptions('state', { skip: 0, search: value, append: false }), 400);
  const debouncedDistrictSearch = useDebounce((value: string) => fetchFieldOptions('district', { skip: 0, search: value, append: false }), 400);
  const debouncedCitySearch = useDebounce((value: string) => fetchFieldOptions('city', { skip: 0, search: value, append: false }), 400);

  const handleFieldSearchChange = (field: PaginatedFieldKey, value: string) => {
    setFieldMeta(prev => ({ ...prev, [field]: { ...prev[field], search: value } }));
    if (field === 'occupation') debouncedOccupationSearch(value);
    else if (field === 'education') debouncedEducationSearch(value);
    else if (field === 'birthPlace') debouncedBirthPlaceSearch(value);
    else if (field === 'country') debouncedCountrySearch(value);
    else if (field === 'state') debouncedStateSearch(value);
    else if (field === 'district') debouncedDistrictSearch(value);
    else debouncedCitySearch(value);
  };

  // State options are re-fetched (page 0) whenever the selected country changes.
  useEffect(() => {
    if (!showFilters || !filters.country) {
      setOptions(prev => ({ ...prev, states: [] }));
      setFieldMeta(prev => ({ ...prev, state: EMPTY_FIELD_META }));
      return;
    }
    fetchFieldOptions('state', { skip: 0, search: '', append: false });
  }, [showFilters, filters.country]);

  // District options are re-fetched (page 0) whenever the selected country or state changes.
  useEffect(() => {
    if (!showFilters || !filters.country) {
      setOptions(prev => ({ ...prev, districts: [] }));
      setFieldMeta(prev => ({ ...prev, district: EMPTY_FIELD_META }));
      return;
    }
    fetchFieldOptions('district', { skip: 0, search: '', append: false });
  }, [showFilters, filters.country, filters.state]);

  // City options are re-fetched (page 0) whenever the selected country, state or district changes.
  useEffect(() => {
    if (!showFilters || !filters.country) {
      setOptions(prev => ({ ...prev, cities: [] }));
      setFieldMeta(prev => ({ ...prev, city: EMPTY_FIELD_META }));
      return;
    }
    fetchFieldOptions('city', { skip: 0, search: '', append: false });
  }, [showFilters, filters.country, filters.state, filters.district]);

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
        newFilters.district = '';
        newFilters.city = '';
      }
      if (name === 'district') {
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
        {errors.initial && (
          <div role="alert" className="mb-4 flex items-center gap-2 p-2.5 rounded-md bg-red-500/5 border border-red-500/30 text-sm">
            <span className="mt-0.5 text-red-500 shrink-0" aria-hidden="true"><WarningCircle /></span>
            <p className="text-red-500 flex-1">Failed to load filter options.</p>
            <button
              type="button"
              onClick={fetchInitialOptions}
              className="flex items-center gap-1 text-red-500 hover:underline shrink-0"
            >
              <span className="scale-75" aria-hidden="true"><RefreshIcon /></span>
              Retry
            </button>
          </div>
        )}
        <MultiSelectPopup
          className="mb-4"
          label="Occupation"
          values={filters.occupation || []}
          options={options.occupations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, occupation: values }))}
          loading={loadingFields.initial}
          hasMore={fieldMeta.occupation.hasMore}
          loadingMore={fieldMeta.occupation.loadingMore}
          loadMoreError={fieldMeta.occupation.error}
          onLoadMore={() => handleLoadMore('occupation')}
          onSearchChange={(value) => handleFieldSearchChange('occupation', value)}
        />
        <MultiSelectPopup
          className="mb-4"
          label="Education"
          values={filters.education || []}
          options={options.educations}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, education: values }))}
          loading={loadingFields.initial}
          hasMore={fieldMeta.education.hasMore}
          loadingMore={fieldMeta.education.loadingMore}
          loadMoreError={fieldMeta.education.error}
          onLoadMore={() => handleLoadMore('education')}
          onSearchChange={(value) => handleFieldSearchChange('education', value)}
        />
        <MultiSelectPopup
          className="mb-6"
          label="Birth Place"
          values={filters.birthPlace || []}
          options={options.birthPlaces}
          onChange={(values) => setFilters((prev: any) => ({ ...prev, birthPlace: values }))}
          loading={loadingFields.initial}
          hasMore={fieldMeta.birthPlace.hasMore}
          loadingMore={fieldMeta.birthPlace.loadingMore}
          loadMoreError={fieldMeta.birthPlace.error}
          onLoadMore={() => handleLoadMore('birthPlace')}
          onSearchChange={(value) => handleFieldSearchChange('birthPlace', value)}
        />
        <hr className="border-t border-border_color block mb-4" />
        <SingleSelectPopup
          className="mb-4"
          label="Country"
          value={filters.country}
          options={options.countries}
          onChange={(val) => handleChange({ target: { name: 'country', value: val } } as any)}
          loading={loadingFields.initial}
          hasMore={fieldMeta.country.hasMore}
          loadingMore={fieldMeta.country.loadingMore}
          loadMoreError={fieldMeta.country.error}
          onLoadMore={() => handleLoadMore('country')}
          onSearchChange={(value) => handleFieldSearchChange('country', value)}
        />
        <SingleSelectPopup
          className="mb-4"
          label="State/Region"
          placeholder="All States/Regions"
          value={filters.state}
          options={options.states}
          onChange={(val) => handleChange({ target: { name: 'state', value: val } } as any)}
          disabled={!filters.country}
          loading={fieldMeta.state.loading}
          hasMore={fieldMeta.state.hasMore}
          loadingMore={fieldMeta.state.loadingMore}
          loadMoreError={fieldMeta.state.error}
          onLoadMore={() => handleLoadMore('state')}
          onSearchChange={(value) => handleFieldSearchChange('state', value)}
        />
        <SingleSelectPopup
          className="mb-4"
          label="District"
          placeholder="All Districts"
          value={filters.district}
          options={options.districts}
          onChange={(val) => handleChange({ target: { name: 'district', value: val } } as any)}
          disabled={!filters.country}
          loading={fieldMeta.district.loading}
          hasMore={fieldMeta.district.hasMore}
          loadingMore={fieldMeta.district.loadingMore}
          loadMoreError={fieldMeta.district.error}
          onLoadMore={() => handleLoadMore('district')}
          onSearchChange={(value) => handleFieldSearchChange('district', value)}
        />
        <SingleSelectPopup
          className="mb-6"
          label="City/Locality"
          placeholder="All Cities/Localities"
          value={filters.city}
          options={options.cities}
          onChange={(val) => handleChange({ target: { name: 'city', value: val } } as any)}
          disabled={!filters.country}
          loading={fieldMeta.city.loading}
          hasMore={fieldMeta.city.hasMore}
          loadingMore={fieldMeta.city.loadingMore}
          loadMoreError={fieldMeta.city.error}
          onLoadMore={() => handleLoadMore('city')}
          onSearchChange={(value) => handleFieldSearchChange('city', value)}
        />
        {locationsError && (
          <div role="alert" className="mb-4 flex items-center gap-2 p-2.5 rounded-md bg-red-500/5 border border-red-500/30 text-sm">
            <span className="mt-0.5 text-red-500 shrink-0" aria-hidden="true"><WarningCircle /></span>
            <p className="text-red-500 flex-1">Failed to load states, districts and cities.</p>
            <button
              type="button"
              onClick={() => {
                if (fieldMeta.state.error) handleLoadMore('state');
                if (fieldMeta.district.error) handleLoadMore('district');
                if (fieldMeta.city.error) handleLoadMore('city');
              }}
              className="flex items-center gap-1 text-red-500 hover:underline shrink-0"
            >
              <span className="scale-75" aria-hidden="true"><RefreshIcon /></span>
              Retry
            </button>
          </div>
        )}
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
