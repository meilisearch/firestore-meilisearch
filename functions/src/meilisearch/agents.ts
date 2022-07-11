import { version } from '../version'

export const constructClientAgents = (
  clientAgents: string[] = []
): string[] => {
  const firebaseAgent = `Meilisearch Firebase (v${version})`

  return clientAgents.concat(firebaseAgent)
}
