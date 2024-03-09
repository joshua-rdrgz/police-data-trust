import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPartner, CreatePartner, AccessToken, QueryKeys } from "../../../helpers/api"
import { toast } from "react-hot-toast"

export const useCreatePartner = (accessToken: AccessToken) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPartner: CreatePartner) => createPartner(newPartner, accessToken),
    onSuccess() {
      toast.success("Partner created successfully!")
      queryClient.invalidateQueries([QueryKeys.PARTNERS])

      // TODO: Send user to the newly created partner's view???
      // Might require some setup to implement.
    },
    onError(error: any) {
      console.error(error)
      toast.error(`Error creating partner: ${error.message}`)
    }
  })
}
