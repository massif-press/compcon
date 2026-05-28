import { defineStore } from 'pinia'
import { GetAll, RemoveItem, SetItem } from '@/io/Storage'
import { ContentCollection } from '@/classes/components/cloud/ContentCollection'

export const ContentCollectionStore = defineStore('content_collection', {
  state: () => ({
    ContentCollections: [] as ContentCollection[],
  }),
  actions: {
    async saveContentCollection(collection: ContentCollection): Promise<void> {
      const index = this.ContentCollections.findIndex(x => x.ID === collection.ID)
      if (index === -1) {
        this.ContentCollections.push(collection)
      } else {
        this.ContentCollections[index] = collection
      }
      await SetItem('content_collection', ContentCollection.Serialize(collection))
    },
    async installCollectionContent(_collection: ContentCollection): Promise<void> {
      // TODO
    },
    async deleteContentCollection(collection: ContentCollection): Promise<void> {
      this.ContentCollections = this.ContentCollections.filter(x => x.ID !== collection.ID)
      await RemoveItem('content_collection', collection.ID)
    },
    async loadContentCollections(): Promise<void> {
      const content = await GetAll('content_collection')
      this.ContentCollections = content.map(x => ContentCollection.Deserialize(x))
    },
  },
})
