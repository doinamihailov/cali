<template>
<div>
    <h5>
        {{this.title}}
    </h5>
    <p class="desc">
        {{this.description}}
    </p>
     <b-card-group deck
      style="margin-left: 20px;
            overflow:auto;
            max-width: 100vw;
            max-height: 100vh"
     >

     <b-card
        v-for="(l, index) in this.lists"
        :key="index"
        :name="l.name" 
        style="max-width: 300px; 
               min-width:300px;
               margin-top:20px;"
        :id="l.id">
        <b-card-title>
        <div
          v-show="l.edit"
        >
        {{l.name}}
        </div>

        <b-form
        v-show="!l.edit" 
        inline
        >
        <label class="mr-sm-2" for="inline-form-input-name">
        </label>
        <b-form-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        v-model="newTitle"
        style="max-width: 230px; 
               min-width:230px"
        ></b-form-input>
        
      </b-form>
      </b-card-title>
      <b-card-body>
        <Cards 
        :cards="l.cards"
        :information="lists"
        :list="l"
        :editBoard="editBoard"
        />
      </b-card-body>

      <template v-slot:footer >
        <div class="icons" > 
        <button 
          v-show="l.edit"
          v-on:click="preEditList(l)"
        >
          <b-icon-pencil></b-icon-pencil>
        </button>
        <button
          v-show="!l.edit"
          v-on:click="editTitle(l)"
          >
           <b-icon-heart></b-icon-heart>
          </button>
        <button>
          <b-icon-trash
            v-on:click="deleteList(l)">
          >
          </b-icon-trash>
        </button>
        </div>
      </template>
      </b-card>
      <b-card 
        style="max-width: 300px; 
                min-width:300px;
                margin-top:20px;"
      >
      <button 
        v-show="this.addlist"
        v-on:click="addlist = false"
      >

        <b-icon-plus
        style="margin-right:10px;"
        ></b-icon-plus>
         Add a new list
      </button>
      <div 
        v-show="!this.addlist"
       style="display:inline;"
      >
        
        <b-form inline>
        <label class="mr-sm-2" for="inline-form-input-name">
          <button
          v-on:click="newList()">
           <b-icon-heart></b-icon-heart>
          </button>
        </label>
        <b-form-input
        id="inline-form-input-name"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Add a new list"
        v-model="newTitle"
        style="max-width: 160px; 
               min-width:160px"
        ></b-form-input>

        <button
        v-on:click="addlist = true"    
        >
        <b-icon-x></b-icon-x>
        </button>
        </b-form>

      </div>
      </b-card>
     </b-card-group>
</div>
</template>

<script>
// @ is an alias to /src
import Cards from '@/components/Cards.vue';
import axios from 'axios';
export default {
  name: 'Board',
  components: {
    Cards
  },
  props: ['id'],
  data () {
    return {
        title: '',
        description: '',
        serverURL : 'http://localhost:5000',
        lists:  [],
        addlist: true,
        newTitle: '',
    }
  },
  mounted () {
      this.getBoard();
  },
  methods: {
    getBoard: function () {
        axios.get(this.serverURL + '/boards')
        .then((res) => {
            const boards = res.data;
            const index = boards.findIndex(x => x.id === this.id);
            this.title = boards[index].name;
            this.description = boards[index].description;
            this.lists = JSON.parse(boards[index].information);
            console.log(this.lists);
        })
        .catch((error) => console.log(error));
    },
    editBoard () {
         //send to db
       const form = new FormData();
       form.set('id', this.id);
       form.set('name', this.title);
       form.set('description', this.description);
       form.set('information', JSON.stringify(this.lists));
       axios.post(this.serverURL + '/boards/edit', form, {
                 headers: { 'Content-Type': 'multipart/form-data' },
       })
       .then((res) => {
          console.log(res);
          this.getBoard();
          this.edit = true;
        })
       .catch((error) => console.log(error));
    },
    newList() {
      let lastId;
      if(this.lists.length != 0)
        lastId = this.lists[this.lists.length - 1].id + 1;
      else
        lastId = 0;
      const newL = {
        id : lastId,
        name: this.newTitle,
        edit: true,
        cards: [],
      }
      this.lists.push(newL);
      this.addlist = true;
      this.editBoard();
      this.newTitle = "";
    },
    deleteList (list) {
      this.lists = this.lists.filter(x => x.id != list.id);
      this.editBoard();
    },
    preEditList (list) {
      list.edit = false;
      this.newTitle = list.name;
    },
    editTitle (list) {
      list.edit = true;
      if (list.name != this.newTitle){
        const index = this.lists.findIndex(x => x.id === list.id);
        this.lists[index].name = this.newTitle;
        this.editBoard();
        this.newTitle='';
      }
    },
      consoleList(msg) {
        console.log(msg);
      }
  }
}
</script>


<style lang="scss" scoped>
  h5, .desc {
      margin-top: 30px;
      margin-left: 40px;
      display: flex;
      justify-content: flex-start;
  }
  button {
      border: none;
      background-color: Transparent;
      outline:none;
      width: none;
      height: none;
      margin: 0;
      text-decoration: none;
  }
  .icons {
      display: flex;
      justify-content: space-between,;
  } 
</style>