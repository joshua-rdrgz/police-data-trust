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

export function getPartners(accessToken: AccessToken) {
  return request({
    method: "GET",
    url: "/partners/", // API will redirect OPTIONS request w/o trailing "/"
    accessToken
  })
}

export function getPartnerById(id: string, accessToken: AccessToken) {
  return request({
    method: "GET",
    url: `/partners/${id}`,
    accessToken
  })
}
