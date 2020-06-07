<template>
  <div class="home">
    <!--
    <img alt="Vue logo" src="../assets/logo.png">
    -->
    <br>
    <div class="firstline" >
      <div class="gem">
        <b-icon-gem></b-icon-gem>
      </div>

    <h5>Personal boards</h5>
    <br>
    <br>
    <br>
    </div>

     <b-card-group deck v-for="row in formattedBoards " v-bind:key="row" >
       
     <b-card
        :title="board.name"
        v-for="(board, index) in row"
        :key="index"
        :name="board.name" 
        style="max-width: 20%; margin-left: 50px;
        margin-top:20px"
        :id="board.id">
      <b-card-text> 
        {{board.description}}
      </b-card-text>
      <template v-slot:footer>
        <div class="icons" >
        <button v-b-modal.modal-2 v-on:click="prepareEditB(board)">
          <b-icon-pencil></b-icon-pencil>
         </button>
        <button v-on:click="deleteB(board.id)">
          <b-icon-trash></b-icon-trash>
        </button>
        </div>
      </template>
      </b-card>
     </b-card-group>


     <button v-b-modal.modal-1 >
       <b-card
          style="margin-top:20px;"
       >
        <b-card-text> 
          Create new board
          <br>
          <div class="plus">
          <b-icon-plus></b-icon-plus>
          </div>
        </b-card-text>
      </b-card>
      </button>

    <HelloWorld msg=""/>
    <div>
    <!-- modal for adding -->
    <b-modal
      id="modal-1"
      ref="modal"
      title="Add board"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="titleState"
          label="Title"
          label-for="title-input"
          invalid-feedback="Title is required"
        >
          <b-form-input
            id="title-input"
            v-model="title"
            :state="titleState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Description"
          label-for="description-input"
        >
          <b-form-input
            id="description-input"
            v-model="description"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <!-- modal for editing --><b-modal
      id="modal-2"
      ref="modal"
      title="Edit board"
      @hidden="resetModal"
      @ok="handleOk2"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit2">
        <b-form-group
          :state="titleState"
          label="Title"
          label-for="title-input"
          invalid-feedback="Title is required"
        >
          <b-form-input
            id="title-input"
            v-model="title"
            :state="titleState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Description"
          label-for="description-input"
        >
          <b-form-input
            id="description-input"
            v-model="description"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Board from '@/components/Board.vue';
import axios from 'axios';
export default {
  name: 'home',
  components: {
    HelloWorld,
    Board
  },
  data () {
    return {
      serverURL : 'http://localhost:5000',
      title: '',
      description:'',
      id: 0,
      information: {},
      titleState: null,
      boards: [],
      edit: false,
    }
  },
  computed: {
      formattedBoards() {
          return this.boards.reduce((c, n, i) => {
              if (i % 4 === 0) c.push([]);
              c[c.length - 1].push(n);
              return c;
          }, []);
      }
  },
  watch : {
    edit: function (val) {
      this.getBoards();
      this.edit = false;
    }
  },
  mounted () {
    this.getBoards();
    console.log(this.boards);
  },
  methods: {
    getBoards: function () {
      axios.get(this.serverURL + '/boards')
      .then((res) => {
            this.boards = res.data;
      })
      .catch((error) => console.log(error));
    },
    addB: function () {

      //ADD BOARD locally
      this.boards.push({
        id: parseInt(this.boards[this.boards.length - 1].id) + 1,
        name: this.title,
        description: this.description,
        information : {}
      });
      const form = new FormData();
      const id = parseInt(this.boards[this.boards.length - 1].id);
      form.set('id', id);
      form.set('name', this.title);
      form.set('description', this.description);
      form.set('information', this.information);
      axios.post(this.serverURL + '/boards', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
           console.log(res);
      })
      .catch((error) => console.log(error));

    },
    prepareEditB: function (board) {
      this.title = board.name;
      this.description = board.description;
      this.id = board.id;
      this.information = board.information;

    },
    editB: function(id, title, description, information) {
       //EDIT BOARD locally
       const index = this.boards.findIndex(x => x.id === id);
       this.boards[index] = {
          id: id,
          name: title,
          description: description,
          information: information
       }
       console.log(this.boards);

       //send to db
       const form = new FormData();
       form.set('id', id);
       form.set('name', title);
       form.set('description', description);
       form.set('information', information);
       axios.post(this.serverURL + '/boards/edit', form, {
                 headers: { 'Content-Type': 'multipart/form-data' },
       })
       .then((res) => {
          console.log(res);
          this.edit = true;
        })
       .catch((error) => console.log(error));
    },
    deleteB: function (id) {
      this.boards = this.boards.filter(x => x.id != id);

      const form = new FormData();
      form.set('id', id);
      axios.post(this.serverURL + '/boards/delete', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
         console.log(res);
      })
      .catch((error) => console.log(error));
    },

      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.titleState = valid
        return valid
      },
      resetModal() {
        this.title = ''
        this.titleState = null
        this.description = ''
        this.id = 0,
        this.information = {}
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      handleSubmit() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        this.addB();
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-1')
        })
      },

      handleOk2(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit2()
      },
      handleSubmit2() {
        // Exit when the form isn't valid
        if (!this.checkFormValidity()) {
          return
        }
        this.editB(this.id, this.title, this.description, this.information);
        // Hide the modal manually
        this.$nextTick(() => {
          this.$bvModal.hide('modal-2')
        })
      }

  }
}
</script>


<style lang="scss" scoped>
  .home {
      .firstline {
        display: flex;
        justify-content: center;

        h5 {
          margin-left: 20px;
        }
        .gem {
          margin-top: -10px;
           font-size: 30px;
        }
    }
    .plus {
        font-size: 35px;
    }
    button {
      border: none;
      background-color: Transparent;
      outline:none;
    }
    .icons {
      display: flex;
      justify-content: space-between,;
    } 
  }
</style>