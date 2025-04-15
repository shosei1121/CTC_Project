import { defineStore } from 'pinia'
import { ref } from 'vue'
import { nfts } from '@/data/nfts'

export const useNftsStore = defineStore('nfts', () => {
  const nftsList = ref([...nfts])

  const getNftById = (id) => {
    return nftsList.value.find(nft => nft.id === id)
  }

  const getNftsByCategory = (category) => {
    return nftsList.value.filter(nft => nft.category === category)
  }

  const getNftsByArtist = (artistId) => {
    return nftsList.value.filter(nft => nft.artistId === artistId)
  }

  const getFeaturedNfts = () => {
    return nftsList.value
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  const getNewestNfts = () => {
    return nftsList.value
      .sort((a, b) => new Date(b.details.created) - new Date(a.details.created))
      .slice(0, 6)
  }

  const getTopSellingNfts = () => {
    return nftsList.value
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6)
  }

  const searchNfts = (query) => {
    const lowerQuery = query.toLowerCase()
    return nftsList.value.filter(nft => 
      nft.name.toLowerCase().includes(lowerQuery) ||
      nft.artist.toLowerCase().includes(lowerQuery) ||
      nft.description.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    nfts: nftsList,
    getNftById,
    getNftsByCategory,
    getNftsByArtist,
    getFeaturedNfts,
    getNewestNfts,
    getTopSellingNfts,
    searchNfts
  }
}) 