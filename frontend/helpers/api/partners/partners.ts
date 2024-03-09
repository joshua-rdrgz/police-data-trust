import { request, AccessToken } from "../base"
import { CreatePartner } from "./types"

export function createPartner(data: CreatePartner, accessToken: AccessToken) {
  return request({
    method: "POST",
    url: "/partners/create",
    data,
    accessToken
  })
}
