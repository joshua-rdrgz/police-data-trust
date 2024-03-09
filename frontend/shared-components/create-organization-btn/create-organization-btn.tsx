import classNames from "classnames"
import { useState } from "react"
import { Dialog as D, PrimaryButton } from "../../shared-components"
import { DialogProvider } from "../dialog/dialog-context"
import styles from "./create-organization-btn.module.css"
import CreateOrganizationForm from "./sub-comps/create-organization-form"

interface CreateOrganizationBtnProps {
  btnClassName?: string
}

export default function CreateOrganizationBtn({ btnClassName }: CreateOrganizationBtnProps) {
  const { triggerBtn } = styles

  const [open, setOpen] = useState(false)

  return (
    <DialogProvider open={open} setOpen={setOpen}>
      <D.Root open={open} onOpenChange={setOpen}>
        <D.Trigger asChild>
          <PrimaryButton className={classNames(triggerBtn, btnClassName)}>
            Create Organization
          </PrimaryButton>
        </D.Trigger>
        <D.Content>
          <D.Header>
            <D.Title>Create Organization</D.Title>
            <D.Description>
              Create an organization if you don&apos;t already have one.
            </D.Description>
          </D.Header>
          <CreateOrganizationForm />
        </D.Content>
      </D.Root>
    </DialogProvider>
  )
}
