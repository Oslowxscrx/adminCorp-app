export enum RoleEnum {
  ADMIN  = 'ADMIN',
  LEADER = 'LEADER',
  STAFF  = 'STAFF',
  RH     = 'RH',
  GUEST = "GUEST"
}

export type RoleEnumKeys = keyof typeof RoleEnum;