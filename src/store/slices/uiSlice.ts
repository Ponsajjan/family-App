import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastState {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    id: string;
}

interface UIState {
    toasts: ToastState[];
    isModalOpen: boolean;
    activeModal: string | null;
    modalData: any;
}

const initialState: UIState = {
    toasts: [],
    isModalOpen: false,
    activeModal: null,
    modalData: null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<Omit<ToastState, 'id'>>) => {
            const id = Math.random().toString(36).substring(2, 9);
            state.toasts.push({ ...action.payload, id });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
        openModal: (state, action: PayloadAction<{ modalName: string; data?: any }>) => {
            state.isModalOpen = true;
            state.activeModal = action.payload.modalName;
            state.modalData = action.payload.data || null;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.activeModal = null;
            state.modalData = null;
        },
    },
});

export const { addToast, removeToast, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
