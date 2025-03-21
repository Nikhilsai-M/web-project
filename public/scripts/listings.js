document.addEventListener('DOMContentLoaded', function () {
  const listingsGrid = document.getElementById('listingsGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('listingModal');
  const closeModal = document.querySelector('.close-modal');
  const modalBody = document.getElementById('modalBody');
  let allListings = []; // Store all listings for filtering

  // Fetch user's listings from the server
  async function fetchListings() {
    try {
      const response = await fetch('/api/customer/listings');
      const data = await response.json();
      
      if (data.success) {
        allListings = data.listings;
        displayListings(allListings); // Display all listings initially
      } else {
        throw new Error(data.message || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      listingsGrid.innerHTML = '<p>Error loading listings. Please try again later.</p>';
    }
  }

  // Display listings in the grid
  function displayListings(listings) {
    listingsGrid.innerHTML = '';
    if (listings.length === 0) {
      listingsGrid.innerHTML = '<p>No listings found.</p>';
      return;
    }

    listings.forEach(listing => {
      const listingCard = document.createElement('div');
      listingCard.classList.add('listing-card');
      const deviceType = listing.type === 'laptop' ? 'Laptop' : 'Phone';
      
      // Add status-rejected class if status is "rejected"
      const statusClass = listing.status === 'rejected' ? 'status-rejected' : '';
      
      let cardContent = `
        <h3>${deviceType}: ${listing.brand} ${listing.model}</h3>
        <p><strong>Status:</strong> <span class="cur-status ${statusClass}">${listing.status}</span></p>
        <p><strong>Submitted:</strong> ${new Date(listing.created_at).toLocaleDateString()}</p>
      `;
      
      // Add rejection reason if status is "rejected"
      if (listing.status === 'rejected' && listing.rejection_reason) {
        cardContent += `
          <p><strong>Rejection Reason:</strong> ${listing.rejection_reason}</p>
        `;
      }
      
      listingCard.innerHTML = cardContent;
      listingCard.addEventListener('click', () => openModal(listing));
      listingsGrid.appendChild(listingCard);
    });
  }

  // Open modal with full form details
  function openModal(listing) {
    const isLaptop = listing.type === 'laptop';
    // Add status-rejected class if status is "rejected"
    const statusClass = listing.status === 'rejected' ? 'status-rejected' : '';
    
    let modalContent = `
      <p><strong>Type:</strong> ${isLaptop ? 'Laptop' : 'Phone'}</p>
      <p><strong>Brand:</strong> ${listing.brand}</p>
      <p><strong>Model:</strong> ${listing.model}</p>
      ${isLaptop 
        ? `
          <p><strong>RAM:</strong> ${listing.ram}</p>
          <p><strong>Storage:</strong> ${listing.storage}</p>
          <p><strong>Processor:</strong> ${listing.processor}</p>
          <p><strong>Generation:</strong> ${listing.generation || 'N/A'}</p>
          <p><strong>Display Size:</strong> ${listing.display_size || 'N/A'}</p>
          <p><strong>Weight:</strong> ${listing.weight || 'N/A'}</p>
          <p><strong>OS:</strong> ${listing.os || 'N/A'}</p>
          <p><strong>Device Age:</strong> ${listing.device_age || 'N/A'}</p>
          <p><strong>Battery Issues:</strong> ${listing.battery_issues || 'N/A'}</p>
        `
        : `
          <p><strong>RAM:</strong> ${listing.ram}</p>
          <p><strong>ROM:</strong> ${listing.rom}</p>
          <p><strong>Processor:</strong> ${listing.processor}</p>
          <p><strong>Network:</strong> ${listing.network}</p>
          <p><strong>Size:</strong> ${listing.size || 'N/A'}</p>
          <p><strong>Weight:</strong> ${listing.weight || 'N/A'}</p>
          <p><strong>Device Age:</strong> ${listing.device_age || 'N/A'}</p>
          <p><strong>Switching On:</strong> ${listing.switching_on || 'N/A'}</p>
          <p><strong>Phone Calls:</strong> ${listing.phone_calls || 'N/A'}</p>
          <p><strong>Cameras Working:</strong> ${listing.cameras_working || 'N/A'}</p>
          <p><strong>Battery Issues:</strong> ${listing.battery_issues || 'N/A'}</p>
          <p><strong>Physically Damaged:</strong> ${listing.physically_damaged || 'N/A'}</p>
          <p><strong>Sound Issues:</strong> ${listing.sound_issues || 'N/A'}</p>
        `}
      <p><strong>Location:</strong> ${listing.location}</p>
      <p><strong>Email:</strong> ${listing.email}</p>
      <p><strong>Phone:</strong> ${listing.phone}</p>
      <p><strong>Status:</strong> <span class="cur-status ${statusClass}">${listing.status}</span></p>
    `;

    // Add rejection reason to modal if status is "rejected"
    if (listing.status === 'rejected' && listing.rejection_reason) {
      modalContent += `
        <p><strong>Rejection Reason:</strong> ${listing.rejection_reason}</p>
      `;
    }

    modalContent += `
      <p><strong>Submitted On:</strong> ${new Date(listing.created_at).toLocaleString()}</p>
      <img src="${listing.image_path}" alt="Device Image" style="max-width: 100%; margin-top: 10px;">
    `;

    modalBody.innerHTML = modalContent;
    modal.style.display = 'flex';
  }

  // Close modal
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Filter listings by status
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.getAttribute('data-filter');

      let filteredListings = allListings;
      if (filter !== 'all') {
        filteredListings = allListings.filter(listing => {
          if (filter === 'pending') return listing.status === 'pending';
          if (filter === 'processing') return listing.status === 'processing';
          if (filter === 'completed') return listing.status === 'approved'; // Updated to show only approved
          if (filter === 'rejected') return listing.status === 'rejected'; // Added for rejected listings
          return true;
        });
      }
      displayListings(filteredListings);
    });
  });

  // Initial fetch
  fetchListings();
});