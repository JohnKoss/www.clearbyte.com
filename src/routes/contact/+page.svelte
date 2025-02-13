<script lang="ts">
    let name = $state("");
    let email = $state("");
    let message = $state("");
    let submitted = $state(false);
  
    function handleSubmit(event: Event) {
      event.preventDefault();
      
      if (!name || !email || !message) {
        alert("Please fill in all fields before submitting.");
        return;
      }
  
      // Simulating form submission
      onsubmit();
  
      // Show confirmation message
      submitted = true;
    }

    function onsubmit() {
    fetch('https://www.clearbyte.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was a problem with your submission. Please try again.');
      });
  }

  </script>
  
  <section class="min-h-screen flex flex-col items-center justify-center p-6 bg-base-200">
    <div class="card w-full max-w-lg bg-base-100 shadow-xl p-6">
      <h2 class="text-3xl font-bold text-primary text-center">Contact Us</h2>
      <p class="text-gray-500 text-center">We'd love to hear from you! Send us a message below.</p>
  
      {#if submitted}
        <div class="alert alert-success mt-4">
          <span>✅ Your message has been sent! We will get back to you soon.</span>
        </div>
        <a href="/" class="btn btn-primary mt-4">Go Home</a>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-4 mt-4">
          <!-- Name Input -->
          <div>
            <label class="label" for="name">
              <span class="label-text">Your Name</span>
            </label>
            <input
              type="text"
              id="name"
              bind:value={name}
              placeholder="Enter your name"
              class="input input-bordered w-full"
              required
            />
          </div>
  
          <!-- Email Input -->
          <div>
            <label class="label" for="email">
              <span class="label-text">Email Address</span>
            </label>
            <input
              type="email"
              id="email"
              bind:value={email}
              placeholder="Enter your email"
              class="input input-bordered w-full"
              required
            />
          </div>
  
          <!-- Message Input -->
          <div>
            <label class="label" for="message">
              <span class="label-text">Message</span>
            </label>
            <textarea
              id="message"
              bind:value={message}
              placeholder="Type your message here..."
              class="textarea textarea-bordered w-full"
              rows="4"
              required
            ></textarea>
          </div>
  
          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-full">Send Message</button>
        </form>
      {/if}
    </div>
  </section>
  