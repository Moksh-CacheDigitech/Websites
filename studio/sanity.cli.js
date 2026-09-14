import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xcmiqpeo',
    dataset: 'production',
  },
  studioHost: 'cachedigitech',
  // Keep local package versions; auto-updates can pull Windows-broken runtimes.
  autoUpdates: false,
})
