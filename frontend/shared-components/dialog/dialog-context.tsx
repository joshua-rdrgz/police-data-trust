import { createContext, useContext } from "react"

export interface DialogContext {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const DialogContext = createContext<DialogContext | null>(null)

export const DialogProvider = ({
  children,
  open,
  setOpen
}: {
  children: React.ReactNode
  open: DialogContext["open"]
  setOpen: DialogContext["setOpen"]
}) => {
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider")
  }
  return context
}
