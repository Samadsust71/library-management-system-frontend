import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DBBook } from "@/types/schema";

interface ModalState {
  isBorrowModalOpen: boolean;
  selectedBook: DBBook | null;
}

const initialState: ModalState = {
  isBorrowModalOpen: false,
  selectedBook: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openBorrowModal: (state, action: PayloadAction<DBBook>) => {
      state.isBorrowModalOpen = true;
      state.selectedBook = action.payload;
    },
    closeBorrowModal: (state) => {
      state.isBorrowModalOpen = false;
      state.selectedBook = null;
    },
  },
});

export const { openBorrowModal, closeBorrowModal } = modalSlice.actions;
export default modalSlice.reducer;
