import create from "zustand";

type ConfirmationMessageState = {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    confirmBtnText?: string;
    onClose: () => void;
    loading?: boolean;
    setLoading: (loading: boolean) => void;
    cancelBtnText?: string;
    onCancel?: () => void;
    setConfirmationMessage: (
        title: string,
        description: string,
        onConfirm: () => void,
        loading?: boolean,
        confirmBtnText?: string,
        onCancel?: () => void,
        cancelBtnText?: string,
        joinTablesConfirmation?: boolean,
    ) => void;
    joinTablesConfirmation: boolean;
    setJoinTablesConfirmation: (joinTablesConfirmation: boolean) => void;
};

export const useConfirmationMessageStore = create<ConfirmationMessageState>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  title: '',
  description: '',
  loading: false,
  setLoading: (loading) => set({ loading }),
  onConfirm: () => {},
  onClose: () =>
    set({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
      confirmBtnText: undefined,
      onCancel: undefined,
      cancelBtnText: undefined,
    }),
  joinTablesConfirmation: false,
  setJoinTablesConfirmation: (joinTablesConfirmation) => set({ joinTablesConfirmation }),
  setConfirmationMessage: (
    title,
    description,
    onConfirm,
    loading,
    confirmBtnText,
    onCancel,
    cancelBtnText,
    joinTablesConfirmation,
  ) =>
    set({
      isOpen: true,
      title,
      description,
      onConfirm,
      loading,
      confirmBtnText,
      onCancel,
      cancelBtnText,
      joinTablesConfirmation,
    }),
}));