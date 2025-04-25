<template>
  <v-card class="mx-auto mb-6" max-width="800">
    <v-card-title>Rechercher une chanson</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="title"
              label="Titre de la chanson"
              prepend-icon="mdi-music-note"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field
              v-model="artist"
              label="Artiste"
              prepend-icon="mdi-account-music"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              block
              type="submit"
              :loading="loading"
              :disabled="!title && !artist"
            >
              Rechercher
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