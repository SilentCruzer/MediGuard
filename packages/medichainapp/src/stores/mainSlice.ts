import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ethers } from 'ethers'
import { UserPayloadObject } from '../interfaces'

interface MainState {
  userName: string
  userEmail: null | string
  userAvatar: null | string
  isFieldFocusRegistered: boolean,
  walletAddress: string | null,
  web3Provider: ethers.providers.Web3Provider | null,
}

const initialState: MainState = {
  /* User */
  userName: '',
  userEmail: null,
  userAvatar: null,

  /* Field focus with ctrl+k (to register only once) */
  isFieldFocusRegistered: false,
  walletAddress: null,
  web3Provider: null,
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserPayloadObject>) => {
      state.userName = action.payload.name
      state.userEmail = action.payload.email
      state.userAvatar = action.payload.avatar
    },
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletAddress = action.payload
    },
    setWeb3Provider: (state, action: PayloadAction<ethers.providers.Web3Provider>) => {
      state.web3Provider = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setWalletAddress, setWeb3Provider } = mainSlice.actions

export default mainSlice.reducer
