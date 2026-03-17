import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface AccountDetail {
  authId: string;
  mainMemberRef: string;
  current: boolean;
}

export interface TermsState {
  loading: boolean;
  moderatorList: any[];
  mainMemberName: string;
  accounts: AccountDetail[];
  currentAuthId: string;
  isModerator: boolean;
}

export const fetchTermsData = createAsyncThunk(
  'terms/fetchTermsData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/terms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 401) {
        return rejectWithValue({ status: 401 });
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return {
        mainMemberName: data.mainMemberName,
        moderatorList: data.moderators,
        currentAuthId: data.currentAuthId,
        accounts: data.allAuthDetails,
        isModerator: data.userType === 'Moderator'
      };
    } catch (error: any) {
      if (error && error.status === 401) return rejectWithValue({ status: 401 });
      return rejectWithValue({ message: error.message || 'Failed to fetch page data' });
    }
  }
);

const initialState: TermsState = {
  loading: true,
  moderatorList: [],
  mainMemberName: '',
  accounts: [],
  currentAuthId: '',
  isModerator: false,
};

const termsSlice = createSlice({
  name: 'terms',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setModeratorList(state, action: PayloadAction<any[]>) {
      state.moderatorList = action.payload;
    },
    setMainMemberName(state, action: PayloadAction<string>) {
      state.mainMemberName = action.payload;
    },
    setAccounts(state, action: PayloadAction<AccountDetail[]>) {
      state.accounts = action.payload;
    },
    setCurrentAuthId(state, action: PayloadAction<string>) {
      state.currentAuthId = action.payload;
    },
    setIsModerator(state, action: PayloadAction<boolean>) {
      state.isModerator = action.payload;
    },
    setTermsData(state, action: PayloadAction<Partial<TermsState>>) {
      return { ...state, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTermsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTermsData.fulfilled, (state, action) => {
        state.loading = false;
        state.mainMemberName = action.payload.mainMemberName;
        state.moderatorList = action.payload.moderatorList;
        state.currentAuthId = action.payload.currentAuthId;
        state.accounts = action.payload.accounts;
        state.isModerator = action.payload.isModerator;
      })
      .addCase(fetchTermsData.rejected, (state, action) => {
        state.loading = false;
      });
  }
});

export const {
  setLoading,
  setModeratorList,
  setMainMemberName,
  setAccounts,
  setCurrentAuthId,
  setIsModerator,
  setTermsData
} = termsSlice.actions;

export default termsSlice.reducer;
