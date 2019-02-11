import { RootState } from "src/state/rootReducer";

export const getCurrentUser = (state: RootState) => state.data.user.currentUser;
