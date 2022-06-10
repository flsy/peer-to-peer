export const trim = (value: string): string => value.trim()
export const toNumber = (value: string): number => Number(value)
export const getPeerPorts = (peers?: string): number[] => peers?.split(',').map(trim).map(toNumber) || []

