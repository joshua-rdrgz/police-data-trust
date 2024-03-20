import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "../../../helpers"
import { CreatePartner, User, usePartner } from "../../../helpers/api"
import { Dialog as D, Form as F, Input, PrimaryButton } from "../../../shared-components"
import { useDialogContext } from "../../dialog/dialog-context"
import { useCreatePartner } from "../hooks/useCreatePartner"
import styles from "./create-organization-form.module.css"
import SelectOrg from "./select-org"
import YesNoToggle from "./yes-no-toggle"

type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>
const createOrganizationSchema = z
  .object({
    organizationName: z.string(),
    existingOrg: z.string(),
    orgExists: z.enum(["YES", "NO"])
  })
  .superRefine(({ organizationName, orgExists }, ctx) => {
    if (orgExists === "NO") {
      if (organizationName.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Organization Name is required.",
          path: ["organizationName"]
        })
      }
    }
  })

export default function CreateOrganizationForm() {
  const { organizationCTA, orgExists } = styles

  const [formCanSubmit, setFormCanSubmit] = useState(true)
  const { setOpen } = useDialogContext()
  const { accessToken, user } = useAuth()
  const createPartnerMutation = useCreatePartner(accessToken)
  const formMethods = useForm<CreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      organizationName: "",
      existingOrg: "",
      orgExists: "NO"
    }
  })

  const selectedOrgId = formMethods.watch("existingOrg")
  const { data: selectedPartner } = usePartner(selectedOrgId, accessToken)

  useEffect(() => {
    const newOrgExistsValue = selectedOrgId ? "YES" : "NO"
    formMethods.setValue("orgExists", newOrgExistsValue)
  }, [selectedOrgId, formMethods])

  const onSubmit = (values: FieldValues) => {
    if (values.orgExists === "YES") {
      setFormCanSubmit(false)
    } else {
      const newPartnerData = mapFormDataToApi(values, user)
      createPartnerMutation.mutate(newPartnerData, {
        onSuccess: () => {
          setOpen(false)
        }
      })
    }
  }

  if (!formCanSubmit) {
    if (!selectedPartner?.contact_email) {
      return <p className={orgExists}>This organization already exists!</p>
    }

    return (
      <p className={orgExists}>
        The organization already exists! For admission, please contact:{" "}
        {selectedPartner.contact_email}
      </p>
    )
  }

  return (
    <F.Root formMethods={formMethods} onSubmit={formMethods.handleSubmit(onSubmit)}>
      <F.Field
        control={formMethods.control}
        name="organizationName"
        render={({ field }) => (
          <F.Item>
            <F.Label>Name of Organization</F.Label>
            <F.Control>
              <Input type="text" {...field} />
            </F.Control>
            <F.Message />
          </F.Item>
        )}
      />
      <F.Field
        control={formMethods.control}
        name="existingOrg"
        render={({ field }) => (
          <F.Item>
            <F.Label>Is your organization one of these?</F.Label>
            <F.Control>
              <SelectOrg value={field.value} onChange={field.onChange} />
            </F.Control>
            <F.Message />
          </F.Item>
        )}
      />
      <F.Field
        control={formMethods.control}
        name="orgExists"
        render={({ field }) => (
          <F.Item>
            <F.Control>
              <YesNoToggle value={field.value} onChange={field.onChange} />
            </F.Control>
          </F.Item>
        )}
      />
      <D.Footer>
        <PrimaryButton
          type="submit"
          className={organizationCTA}
          disabled={createPartnerMutation.isLoading}>
          {createPartnerMutation.isLoading ? "Creating..." : "Create Organization"}
        </PrimaryButton>
      </D.Footer>
    </F.Root>
  )
}

function mapFormDataToApi(formData: CreateOrganizationSchema, userData: User): CreatePartner {
  return {
    name: formData.organizationName,
    contact_email: userData.email
  }
}
