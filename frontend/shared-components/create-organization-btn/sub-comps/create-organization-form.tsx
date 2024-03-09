import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "../../../helpers"
import { CreatePartner, User } from "../../../helpers/api"
import { Dialog as D, Form as F, Input, PrimaryButton } from "../../../shared-components"
import { useCreatePartner } from "../hooks/useCreatePartner"
import styles from "./create-organization-form.module.css"
import SelectOrg from "./select-org"
import YesNoToggle from "./yes-no-toggle"

type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>
const createOrganizationSchema = z.object({
  organizationName: z.string().min(1, "Organization Name is required."),
  existingOrg: z.string(),
  orgExists: z.enum(["YES", "NO"])
})

export default function CreateOrganizationForm() {
  const { organizationCTA, orgExists } = styles

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

  const [formCanSubmit, setFormCanSubmit] = useState(true)

  const onSubmit = (values: FieldValues) => {
    if (values.orgExists === "YES") {
      setFormCanSubmit(false)
    } else {
      const newPartnerData = mapFormDataToApi(values, user)
      createPartnerMutation.mutate(newPartnerData, {
        onSuccess: () => {
        }
      })
    }
  }

  if (!formCanSubmit) {
    return (
      <p className={orgExists}>
        The organization already exists! For admission, please contact: org@email.com
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
