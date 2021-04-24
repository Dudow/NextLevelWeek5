import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string,
  members: string,
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number,
  isLooping: boolean,
  isPlaying: boolean,
  isShuffling: boolean,
  hasPrevious: boolean,
  hasNext: boolean,
  play: (episode: Episode) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playList: (list: Episode[], index: number) => void
  playNext: () => void
  playPrevious: () => void
  setPlayingState: (state: boolean) => void
  handleEpisodeEnded: () => void
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({children}: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {

    if(isShuffling){
      const randomNextEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(randomNextEpisodeIndex)
    } else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {

    if(currentEpisodeIndex <= 0){
      return
    }

    setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state)
  }


  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      setEpisodeList([])
      setCurrentEpisodeIndex(0)
    }
  }

  return(
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      isPlaying,
      togglePlay,
      isLooping,
      toggleLoop,
      isShuffling,
      toggleShuffle,
      playList,
      playPrevious,
      playNext,
      setPlayingState,
      play,
      hasPrevious,
      hasNext,
      handleEpisodeEnded
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}