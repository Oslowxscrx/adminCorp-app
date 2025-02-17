export enum RoleEnum {
  ADMIN = 'ADMIN',
  BODEGA = 'BODEGA',
  RH = 'RH'
}

export type RoleEnumKeys = keyof typeof RoleEnum;