const app = Vue.createApp({
      data() {
        return {
          content: [],
          currentPage: 1,
          itemsPerPage: 20
        };
      },
      computed: {
        totalPages() {
          return Math.ceil(this.content.length / this.itemsPerPage);
        },
        paginatedContent() {
          const start = (this.currentPage - 1) * this.itemsPerPage;
          const end = start + this.itemsPerPage;
          return this.content.slice(start, end);
        }
      },
      mounted() {
        this.fetchData();
      },
      methods: {
        async fetchData() {
          try {
            const response = await fetch('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json');
            const outData = await response.json();
            this.content = outData.result.records;
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        },
        handlePageChange(page) {
          this.currentPage = page;
        }
      }
    });

    app.component('card', {
      props: [
        'url',
        'name',
        'opentime',
        'address',
        'tel'
      ],
      template: `      
      <div class="card col-sm-6">
        <div class="position-relative">
          <img :src="url" class="card-img-top img-cover" alt="..." >
          <h5 class="card-title position-absolute bottom-0 start-0 text-light m-0">{{ name }}</h5>
        </div>
        <div class="card-body">
          <p class="card-text">{{ opentime }}</p>
          <p class="card-text">{{ address }}</p>
          <p class="card-text">{{ tel }}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
      `
    });

    app.component('pagination', {
      props: ['totalPages', 'currentPage'],
      methods: {
        changePage(page) {
          this.$emit('page-changed', page);
        }
      },
      computed: {
        totalPagesArray() {
          return Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
      },
      template: `
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPagesArray" :key="page">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>
      `
    });

    app.mount('#app');