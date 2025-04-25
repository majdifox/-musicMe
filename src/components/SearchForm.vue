<template>
  <v-card class="mx-auto mb-6 rounded-xl" max-width="800">
    <v-card-title>Find a Song</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="title"
              label="Song Title"
              prepend-icon="mdi-music-note"
              clearable
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="artist"
              label="Artist"
              prepend-icon="mdi-account-music"
              clearable
              variant="underlined"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="pink"
              block
              type="submit"
              :loading="loading"
              :disabled="!title && !artist"
              rounded="pill"
            >
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SearchForm',
  
  data() {
    return {
      title: '',
      artist: ''
    }
  },
  
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  
  methods: {
    onSubmit() {
      if (!this.title && !this.artist) {
        return;
      }
      
      this.$emit('search', {
        title: this.title,
        artist: this.artist
      });
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
</style>