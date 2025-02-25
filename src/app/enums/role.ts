export enum RoleEnum {
  ADMIN  = 'ADMIN',
  USER   = 'USER',
  LEADER = 'LEADER',
  STAFF  = 'STAFF',
  RH     = 'RH'
}

export type RoleEnumKeys = keyof typeof RoleEnum;