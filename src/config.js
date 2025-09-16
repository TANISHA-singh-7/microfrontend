export const config = {
  musicLibraryUrl: import.meta.env.PROD 
    ? 'https://music-library-mf.netlify.app/assets/remoteEntry.js'
    : 'http://localhost:3001/assets/remoteEntry.js'
}