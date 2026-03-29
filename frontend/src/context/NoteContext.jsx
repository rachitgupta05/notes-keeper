import { createContext, useEffect } from "react";
import { useState } from "react";
import  BACKEND_URL from "../api/url";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotes = async () => {
    setLoading(true);
    try {
      const response = await BACKEND_URL.get("/get-notes")
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getNotes();
  },[])

  const createNote = async (note) => {
    const res = await BACKEND_URL.post("/create-note", note)
    setNotes([...notes, res.data])
  }

  const updateNote = async (id, note) => {
    const res = await BACKEND_URL.put(`/update-note/${id}`, note)
    setNotes(notes.map((note) => note._id === id ? res.data : note))
  }

  const deleteNote = async (id) => { 
    const res= await BACKEND_URL.delete(`/delete-note/${id}`)
    setNotes(notes.filter(note=> note._id!==id))
  }

  return (
    <NoteContext.Provider value={{ notes, createNote, updateNote, deleteNote, loading }} >
      {children}
    </NoteContext.Provider>
  )
}