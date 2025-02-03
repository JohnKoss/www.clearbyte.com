<script>
    import '../style.css';
    import Logo from '$lib/Logo.svelte';
    let { children } = $props();    
</script>

<!-- Navbar -->
<nav class="navbar bg-base-100">
    <div class="flex-1">
        <Logo />
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal p-0">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/opt-in" class="btn btn-warning btn-sm">SMS Opt-in</a></li> 
        </ul>
    </div>
</nav>

{@render children()}

<!-- Footer -->
<footer class="footer flex items-center justify-center p-4 bg-base-300 text-base-content text-center">
    <p>&copy; {new Date().getFullYear()} ClearByte. All rights reserved.</p>
  </footer>
  
