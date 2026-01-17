import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-hot-toast"

const initialState = {
  pastes: []
}

const pasteSlice = createSlice({
  name: "paste",
  initialState,
  reducers: {

  fetchPastes: (state, action) => {
      state.pastes = action.payload
    },
    addToPastes: (state, action) => {
      const paste = action.payload

      if( paste.title === ""){
        toast.error("Title is required");
        return 
      }
      if( paste.content === ""){
        toast.error("Content is required");
        return 
      }
      //const index = state.pastes.findIndex((item) => item._id === paste._id)
      

      // if (index >= 0) {
      //   // If the course is already in the Pastes, do not modify the quantity
      //   toast.error("Paste already exist")
      //   return
      // }
      // If the course is not in the Pastes, add it to the Pastes
      state.pastes.push(paste);
      toast.success("Paste added");
      
      
    },

    updatePastes: (state, action) => {
      const paste = action.payload
      const index = state.pastes.findIndex((item) => item._id === paste._id)

      if (index >= 0) {
        // If the course is found in the Pastes, update it
        state.pastes[index] = paste;

        // show toast
        toast.success("Paste updated");
      }
    },
    removeFromPastes: (state, action) => {
      const pasteId = action.payload

      console.log(pasteId)
      const index = state.pastes.findIndex((item) => item._id === pasteId)

      if (index >= 0) {
        // If the course is found in the Pastes, remove it
        state.pastes.splice(index, 1)

        // show toast
        toast.success("Paste deleted")
      }
    },
    resetPaste: (state) => {
      state.pastes = []
      // Update to localstorage
      localStorage.removeItem("pastes")
    },
  },
})

export const { fetchPastes,addToPastes, removeFromPastes, updatePastes } = pasteSlice.actions

export default pasteSlice.reducer