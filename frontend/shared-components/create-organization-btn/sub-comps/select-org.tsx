import { useAuth } from "../../../helpers"
import { Partner, usePartners } from "../../../helpers/api"
import { Select as S } from "../../../shared-components"
import styles from "./select-org.module.css"

interface SelectOrgProps {
  value: string
  onChange(...event: any[]): void
}

export default function SelectOrg({ value, onChange }: SelectOrgProps) {
  const { accessToken } = useAuth()
  const { data: partnersData, isLoading, isError } = usePartners(accessToken)

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (isError) {
    return <div className={styles.error}>Error occurred while fetching organizations.</div>
  }

  return (
    <S.Root value={value} onValueChange={onChange}>
      <S.Trigger>
        <S.Value placeholder="Pick an organization if it's yours..." />
      </S.Trigger>
      <S.Content>
        {partnersData?.results.map((partner: Partner) => (
          <S.Item key={partner.id} value={partner.id.toString()}>
            {partner.name}
          </S.Item>
        ))}
      </S.Content>
    </S.Root>
  )
}
