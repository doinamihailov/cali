<template>
<div>
   <b-card-group
    style="margin-left:-30px;"
   >
    <button>
     <b-card
        v-for="(card, index) in this.cards"
        :key="index"
        :name="card.name" 
        v-on:click="openSweetModal(card)"
        style="max-width: 240px; 
               min-width: 240px;
               max-height: 50px
               margin-left: -50px;
               margin-top: 10px"
        :id="card.id">
        <b-card-title
        style="font-weight: normal;
              font-size: 15px;
              "
        >
          {{card.name}}
        </b-card-title>
        <b-card-body>
        </b-card-body>
     </b-card>
    </button>
      <b-card 
        style="max-width: 260px; 
               min-width: 260px
               outline: none;
               margin-left:10px;
               margin-top: 10px"
      >
      <button 
        v-show="this.addCard"
        v-on:click="addCard = false"
      >

        <b-icon-plus
        style="margin-right:10px;"
        ></b-icon-plus>
         Add a new card
      </button>

      <div 
        v-show="!this.addCard"
       style="display:inline;"
      >
        <b-form inline>
        <label class="mr-sm-2" for="inline-form-input-name">
          <button
          v-on:click="newCard()">
           <b-icon-heart
            style="margin-left:-10px;"
           ></b-icon-heart>
          </button>
        </label>
        <b-form-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Add a new card"
        v-model="newCardTitle"
        style="max-width: 140px; 
              min-width:140px;"
        ></b-form-input>

        <button
        v-on:click="addCard = true"    
        >
        <b-icon-x></b-icon-x>
        </button>
        </b-form>

      </div>


      </b-card>
   </b-card-group>

   <!-- modal -->
    <sweet-modal 
    ref="swmodal"
    hide-close-button
    >
    <div class="cardTitle">
      <button 
      v-show="this.showTitle" 
      v-on:click="editT()"
      >
        <h4
          style="
          display: inline;
          display: flex;
          justify-content: center;"
          >
        <b-icon-puzzle
        style="margin-right:10px;">
        </b-icon-puzzle>
        {{this.cardTitle}}
        </h4>
      </button>


      <div 
        v-show="this.showEditTitle"
       style="display:inline;
              display: flex;
              justify-content: center;"
      >
        
        <b-form inline>
        <label class="mr-sm-2" for="inline-form-input-name">
          <button
          v-on:click="newTitle()">
           <b-icon-heart></b-icon-heart>
          </button>
        </label>
        <b-form-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Add a new list"
        v-model="newCardTitle"
        style="max-width: 180px; min-width:180px"
        ></b-form-input>

        <button
        v-on:click="closeTitle()"    
        >
        <b-icon-x></b-icon-x>
        </button>
        </b-form>

      </div>


    </div>
    <div class="content">
      <!--add desc button -->
     <button 
      v-show="this.showAdd" 
      v-on:click="openModify()"
      >
        <b-icon-plus
        style="margin-right:10px;"
        ></b-icon-plus>
         Add a description
      </button>
    <!-- add/modify desc form -->
     <div 
        v-show="this.showModify"
       style="
       display: inline;
       display: flex;
       justify-content: center;"
      >
        <b-form inline>
        <label class="mr-sm-2" for="inline-form-input-name">
          <button
          v-on:click="newDescription()">
           <b-icon-heart
            style="margin-left:-10px;"
           ></b-icon-heart>
          </button>
        </label>
        <textarea
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Add a description"
        v-model="newDesc"
        style="width: 400px;
              height: 200px;
              display: block"
        ></textarea>

        <button
        v-on:click="choose()"    
        >
        <b-icon-x></b-icon-x>
        </button>
        </b-form>

      </div>
    <!-- desc -->
     <button v-show="this.showDesc"
            v-on:click="editD()"
     >
     <b-icon-filter-left
     style="margin-right:10px;">
     </b-icon-filter-left>
      {{this.cardDesc}}
     </button>
    </div>

    <!-- footer w/ icons -->
       <div 
        class="icons" 
        style="margin-top:50px;
              display: flex;
              justify-content: space-between;"
      >
        <button>
          <b-icon-trash
            v-on:click="deleteCard()">
          >
          </b-icon-trash>
        </button>
        <button>
          <b-icon-x
            v-on:click="closeModal()">
          >
          </b-icon-x>
        </button>
       </div>
    </sweet-modal>
</div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';
export default {
  name: 'Cards',
  components: {
  },
  props: {
      cards: Array,
      information: Array,
      list: Object,
      editBoard: {type: Function},
  },
  data () {
    return {
      addCard: true,
      newCardTitle: '',
      cardTitle: '',
      cardDesc: '',
      newDesc: '',
      cardID: 0,
      showDesc: false,
      showAdd: false,
      showModify: false,
      showTitle: false,
      showEditTitle: false,
    }
  },
  mounted () {
  },
  methods: {
    newCard() {
      console.log(this.newCardTitle);
      this.addCard = true;
      const index = this.information.findIndex(x => x.id === this.list.id);
      var lastId;
      if(this.list.cards.length === 0)
        lastId = 0;
      else
        lastId = this.list.cards[this.list.cards.length - 1].id + 1;
      this.information[index].cards.push({
        id : lastId,
        name: this.newCardTitle,
        desc: '',
      });
      this.editBoard();
      console.log(this.list);
      this.newCardTitle = '';
    },
    openSweetModal(card) {
      this.cardTitle = card.name;
      this.cardDesc = card.desc;
      this.cardID = card.id;
      this.choose();
      this.$refs.swmodal.open();
    },
    newDescription() {
       const index = this.information.findIndex(x => x.id === this.list.id);
       const index2 = this.information[index].cards.findIndex(x => x. id === this.cardID);
       this.information[index].cards[index2].desc = this.newDesc;
       this.cardDesc = this.newDesc;
       this.editBoard();
       this.showDesc = true;
       this.showModify = false;
       this.showAdd = false;
       this.newDesc = '';
    },
    choose() {
      this.showAdd = false;
      this.showModify = false;
      this.showDesc = false;
      this.showTitle = true;
      this.showEditTitle = false;
      if(this.cardDesc === '')
        this.showAdd = true;
      else
        this.showDesc = true;
    },
    deleteCard() {
      const index = this.information.findIndex(x => x.id === this.list.id);
      var modif = this.information;
      this.information[index].cards = this.information[index].cards.filter(x => x.id !== this.cardID);
      console.log(this.information[index].cards);
      this.editBoard();
      this.closeModal();
    },
    closeModal() {
      this.showAdd = false;
      this.showModify = false;
      this.showDesc = false;
      this.showTitle = false;
      this.showEditTitle = false;
      this.$refs.swmodal.close();

    },
    openModify(){
      this.showAdd = false;
      this.showModify = true;
      this.showDesc = false;
    },
    editD() {
      this.newDesc = this.cardDesc;
      this.openModify();
    },
    editT() {
      this.showTitle = false;
      this.showEditTitle = true;
      this.newCardTitle = this.cardTitle;
    },
    closeTitle() {
      this.showTitle = true;
      this.showEditTitle = false;
      this.newCardTitle = '';
    },
    newTitle() {
       const index = this.information.findIndex(x => x.id === this.list.id);
       const index2 = this.information[index].cards.findIndex(x => x. id === this.cardID);
       this.information[index].cards[index2].name = this.newCardTitle;
       this.cardTitle = this.newCardTitle;
       this.editBoard();
       this.showTitle = true;
       this.showEditTitle = false;
       this.newCardTitle = '';
    },
  }
}
</script>


<style lang="scss" scoped>
  button {
        border: none;
        background-color: Transparent;
        outline:none;
        width: none;
        height: none;
        margin: 0;
        text-decoration: none;
    }

  button:focus {
    outline: 0;
  }

</style>