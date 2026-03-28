import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AccountDetail {
  authId: string;
  mainMemberRef: string;
  current: boolean;
  updatedAt?: number;
}

/** Format consumed by ChoosePopup: { authId, name } */
export interface ChoosePopupAccount {
  authId: string;
  name: string | null;
}

export interface Moderator {
  moderatorName: string;
  moderatorContact: string;
}

export interface ModeratorGroup {
  id: number;
  mainMemberName: string;
  moderators: Moderator[];
}

/** Derives the ChoosePopup list from the full accounts array */
const toChoosePopup = (accounts: AccountDetail[]): ChoosePopupAccount[] =>
  accounts
    .filter(acc => acc.current)
    .map(acc => ({ authId: acc.authId, name: acc.mainMemberRef }));

// ─── State ───────────────────────────────────────────────────────────────────

export interface TermsState {
  loading: boolean;
  moderatorGroups: ModeratorGroup[];
  mainMemberName: string;
  accounts: AccountDetail[];
  choosePopupAccounts: ChoosePopupAccount[];  // current:true accounts in ChoosePopup format
  currentAuthId: string;
  isModerator: boolean;
  familyLastUpdates: Record<string, number>;
}

// ─── Thunk ───────────────────────────────────────────────────────────────────

export const fetchTermsData = createAsyncThunk(
  'terms/fetchTermsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/terms`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 401) return rejectWithValue({ status: 401 });
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      const accounts = data.allAuthDetails as AccountDetail[];
      const familyLastUpdates: Record<string, number> = {};
      accounts.forEach(acc => {
        if (acc.authId && acc.updatedAt) {
          familyLastUpdates[acc.authId] = acc.updatedAt;
        }
      });

      return {
        mainMemberName: data.mainMemberName,
        moderatorGroups: data.moderatorGroups,
        currentAuthId: data.currentAuthId,
        accounts: accounts,
        isModerator: data.userType === 'Moderator',
        familyLastUpdates,
      };
    } catch (error: any) {
      if (error && error.status === 401) return rejectWithValue({ status: 401 });
      return rejectWithValue({ message: error.message || 'Failed to fetch page data' });
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: TermsState = {
  loading: true,
  moderatorGroups: [],
  mainMemberName: '',
  accounts: [],
  choosePopupAccounts: [],
  currentAuthId: '',
  isModerator: false,
  familyLastUpdates: {},
};

const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setModeratorGroups(state, action: PayloadAction<ModeratorGroup[]>) {
      state.moderatorGroups = action.payload;
    },
    setMainMemberName(state, action: PayloadAction<string>) {
      state.mainMemberName = action.payload;
    },
    setAccounts(state, action: PayloadAction<AccountDetail[]>) {
      state.accounts = action.payload;
      state.choosePopupAccounts = toChoosePopup(action.payload);
    },
    setCurrentAuthId(state, action: PayloadAction<string>) {
      state.currentAuthId = action.payload;
    },
    setIsModerator(state, action: PayloadAction<boolean>) {
      state.isModerator = action.payload;
    },
    setTermsData(state, action: PayloadAction<Partial<TermsState>>) {
      return { ...state, ...action.payload };
    },
    setChoosePopupAccounts(state, action: PayloadAction<ChoosePopupAccount[]>) {
      state.choosePopupAccounts = action.payload;
    },
    setFamilyLastUpdates(state, action: PayloadAction<Record<string, number>>) {
      state.familyLastUpdates = { ...state.familyLastUpdates, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTermsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTermsData.fulfilled, (state, action) => {
        state.loading = false;
        state.mainMemberName = action.payload.mainMemberName;
        state.moderatorGroups = action.payload.moderatorGroups;
        state.currentAuthId = action.payload.currentAuthId;
        state.accounts = action.payload.accounts;
        state.choosePopupAccounts = toChoosePopup(action.payload.accounts);
        state.isModerator = action.payload.isModerator;
        state.familyLastUpdates = { ...state.familyLastUpdates, ...action.payload.familyLastUpdates };
      })
      .addCase(fetchTermsData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setLoading,
  setModeratorGroups,
  setMainMemberName,
  setAccounts,
  setCurrentAuthId,
  setIsModerator,
  setTermsData,
  setChoosePopupAccounts,
  setFamilyLastUpdates,
} = termsSlice.actions;

export default termsSlice.reducer;

// ─── Selector ─────────────────────────────────────────────────────────────────

/** Simple state accessor — ChoosePopup reads this instead of the data prop */
export const selectChoosePopupAccounts = (state: { terms: TermsState }): ChoosePopupAccount[] =>
  state.terms.choosePopupAccounts;

