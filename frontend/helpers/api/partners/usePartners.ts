import { useQuery } from "@tanstack/react-query"
import { AccessToken, QueryKeys, getPartners } from ".."

export function usePartners(accessToken: AccessToken) {
  return useQuery({
    queryKey: [QueryKeys.PARTNERS],
    queryFn: () => getPartners(accessToken)
  })
}
