<script lang="ts">
    let { image,text,author } = $props();   
    // export let image = "/assets/img/person1a.jpg"; // Testimonial image path
    // export let text = "The labs were clear, intuitive, and easy to follow. Thanks guys!";
    // export let author = "Aisha";
  </script>
  
  <div class="card bg-base-100 shadow-xl p-6 max-w-xl mx-auto">
    <div class="flex items-center space-x-4">
      <!-- Profile Image -->
      <figure class="w-16 h-16">
        <img class="rounded-full w-full h-full object-cover" src={image} alt="User Image" />
      </figure>
  
      <!-- Testimonial Content -->
      <div>
        <p class="text-lg text-gray-700 flex items-center">
          <!-- Left Quote Icon -->
          <span class="text-gray-400">
            <svg
              aria-hidden="true"
              class="w-5 h-5 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"
              />
            </svg>
          </span>
  
          <span class="px-2">{text}</span>
  
          <!-- Right Quote Icon -->
          <span class="text-gray-400">
            <svg
              aria-hidden="true"
              class="w-5 h-5 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24-10.7-24-24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"
              />
            </svg>
          </span>
        </p>
  
        <!-- Author Name -->
        <p class="text-gray-500 italic text-sm mt-2">- {author}</p>
      </div>
    </div>
  </div>
  