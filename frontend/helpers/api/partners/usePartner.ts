import { useQuery } from "@tanstack/react-query"
import { getPartnerById, AccessToken, QueryKeys } from ".."

export function usePartner(partnerId: string, accessToken: AccessToken) {
  return useQuery({
    queryKey: [QueryKeys.PARTNER, partnerId],
    queryFn: () => getPartnerById(partnerId, accessToken),
    enabled: !!partnerId && !!accessToken
  })
}
