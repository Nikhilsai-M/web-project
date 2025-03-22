document.addEventListener("DOMContentLoaded", function () {
  console.log("verify-listings.js loaded!");
  const listingsContainer = document.getElementById("listingsContainer");
  const modal = document.getElementById("applicationModal");
  const applicationDetails = document.getElementById("applicationDetails");
  const actionButtons = document.getElementById("actionButtons");
  const closeModal = document.querySelector(".close");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let currentApplication = null;
  let allApplications = [];

  // Fetch all applications
  async function fetchApplications() {
      console.log("Fetching applications...");
      try {
          const response = await fetch('/api/supervisor/verify-applications');
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Response data:", data);
          if (data.success) {
              allApplications = data.applications;
              displayApplications(allApplications); // Display all initially
          } else {
              listingsContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${data.message || 'No applications found.'}</div>`;
          }
      } catch (error) {
          console.error('Error fetching applications:', error);
          listingsContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Error loading applications: ${error.message}</div>`;
      }
  }

  // Display applications in the container
  function displayApplications(applications) {
      listingsContainer.innerHTML = '';
      if (applications.length === 0) {
          listingsContainer.innerHTML = '<div class="no-applications"><i class="fas fa-info-circle"></i> No applications found.</div>';
          return;
      }

      applications.forEach(app => {
          const card = document.createElement('div');
          card.classList.add('listing-card');
          const statusClass = app.status === 'rejected' ? 'status-rejected' : '';
          card.innerHTML = `
              <h3>${app.type === 'phone' ? 'Phone' : 'Laptop'} Application #${app.id}</h3>
              <p><strong>Brand:</strong> ${app.brand}</p>
              <p><strong>Model:</strong> ${app.model}</p>
              <p><strong>Status:</strong> <span class="cur-status ${statusClass}">${app.status}</span></p>
              <p><strong>Submitted:</strong> ${new Date(app.created_at).toLocaleDateString()}</p>
              ${app.price ? `<p><strong>Price:</strong> ₹${app.price}</p>` : ''}
              <button class="btn-verify"><i class="fas fa-eye"></i> View Details</button>
          `;
          card.querySelector('.btn-verify').addEventListener('click', () => showApplicationDetails(app));
          listingsContainer.appendChild(card);
      });
  }

  // Show application details in modal
  async function showApplicationDetails(app) {
      try {
          const response = await fetch(`/api/supervisor/application/${app.type}/${app.id}`);
          const data = await response.json();
          if (data.success) {
              currentApplication = { type: data.type, id: data.application.id };
              const statusClass = data.application.status === 'rejected' ? 'status-rejected' : '';
              applicationDetails.innerHTML = `
                  <p><strong>Type:</strong> ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}</p>
                  <p><strong>ID:</strong> ${data.application.id}</p>
                  <p><strong>Brand:</strong> ${data.application.brand}</p>
                  <p><strong>Model:</strong> ${data.application.model}</p>
                  <p><strong>RAM:</strong> ${data.application.ram}</p>
                  ${data.type === 'phone' ? `
                      <p><strong>ROM:</strong> ${data.application.rom}</p>
                      <p><strong>Processor:</strong> ${data.application.processor}</p>
                      <p><strong>Battery:</strong> ${data.application.battery} mAh</p>
                      <p><strong>Camera:</strong> ${data.application.camera}</p>
                      <p><strong>OS:</strong> ${data.application.os || 'N/A'}</p>
                      <p><strong>Network:</strong> ${data.application.network}</p>
                      <p><strong>Size:</strong> ${data.application.size || 'N/A'}</p>
                      <p><strong>Weight:</strong> ${data.application.weight || 'N/A'}</p>
                      <p><strong>Device Age:</strong> ${data.application.device_age}</p>
                      <p><strong>Switching On:</strong> ${data.application.switching_on}</p>
                      <p><strong>Phone Calls:</strong> ${data.application.phone_calls}</p>
                      <p><strong>Cameras Working:</strong> ${data.application.cameras_working}</p>
                      <p><strong>Battery Issues:</strong> ${data.application.battery_issues}</p>
                      <p><strong>Physically Damaged:</strong> ${data.application.physically_damaged}</p>
                      <p><strong>Sound Issues:</strong> ${data.application.sound_issues}</p>
                  ` : `
                      <p><strong>Storage:</strong> ${data.application.storage}</p>
                      <p><strong>Processor:</strong> ${data.application.processor}</p>
                      <p><strong>Generation:</strong> ${data.application.generation || 'N/A'}</p>
                      <p><strong>Display Size:</strong> ${data.application.display_size || 'N/A'}</p>
                      <p><strong>Weight:</strong> ${data.application.weight || 'N/A'}</p>
                      <p><strong>OS:</strong> ${data.application.os || 'N/A'}</p>
                      <p><strong>Device Age:</strong> ${data.application.device_age || 'N/A'}</p>
                      <p><strong>Battery Issues:</strong> ${data.application.battery_issues || 'N/A'}</p>
                  `}
                  <p><strong>Location:</strong> ${data.application.location}</p>
                  <p><strong>Email:</strong> ${data.application.email}</p>
                  <p><strong>Phone:</strong> ${data.application.phone}</p>
                  <p><strong>Image:</strong> <a href="${data.application.image_path}" target="_blank">View Image</a></p>
                  <p><strong>Status:</strong> <span class="cur-status ${statusClass}">${data.application.status}</span></p>
                  ${data.application.rejection_reason ? `<p><strong>Rejection Reason:</strong> ${data.application.rejection_reason}</p>` : ''}
                  ${data.application.price ? `<p><strong>Price:</strong> ₹${data.application.price}</p>` : ''}
                  <p><strong>Submitted:</strong> ${new Date(data.application.created_at).toLocaleString()}</p>
              `;

              // Dynamically set buttons based on status
              actionButtons.innerHTML = '';
              if (data.application.status === 'pending') {
                  actionButtons.innerHTML = `
                      <button id="rejectBtn" class="btn reject"><i class="fas fa-times"></i> Reject</button>
                      <button id="processingBtn" class="btn processing"><i class="fas fa-hourglass-half"></i> Proceed to Physical Verification</button>
                  `;
                  document.getElementById('rejectBtn').addEventListener('click', () => updateStatus('rejected'));
                  document.getElementById('processingBtn').addEventListener('click', () => updateStatus('processing'));
              } else if (data.application.status === 'processing') {
                  actionButtons.innerHTML = `
                      <button id="rejectBtn" class="btn reject"><i class="fas fa-times"></i> Reject</button>
                      <button id="approveBtn" class="btn approve"><i class="fas fa-check"></i> Approve</button>
                  `;
                  document.getElementById('rejectBtn').addEventListener('click', () => updateStatus('rejected'));
                  document.getElementById('approveBtn').addEventListener('click', () => updateStatusWithPrice('approved'));
              }

              modal.style.display = 'flex';
          } else {
              alert('Error loading application details: ' + data.message);
          }
      } catch (error) {
          console.error('Error fetching application details:', error);
          alert('Error loading application details.');
      }
  }

  // Update application status
  async function updateStatus(status) {
      if (!currentApplication) return;

      let rejectionReason = null;
      if (status === 'rejected') {
          rejectionReason = prompt('Please provide a reason for rejection (optional):');
      }

      try {
          const response = await fetch(`/api/supervisor/application/${currentApplication.type}/${currentApplication.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status, rejectionReason })
          });
          const data = await response.json();

          if (data.success) {
              alert('Status updated successfully!');
              modal.style.display = 'none';
              fetchApplications();
          } else {
              alert('Error updating status: ' + data.message);
          }
      } catch (error) {
          console.error('Error updating status:', error);
          alert('Error updating status.');
      }
  }

  // Update status with price for approval
  async function updateStatusWithPrice(status) {
      if (!currentApplication) return;

      const price = prompt('Please enter the price for this listing:');
      if (!price || isNaN(price) || Number(price) <= 0) {
          alert('Please enter a valid price.');
          return;
      }

      try {
          const response = await fetch(`/api/supervisor/application/${currentApplication.type}/${currentApplication.id}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status, price: Number(price) })
          });
          const data = await response.json();

          if (data.success) {
              alert('Listing approved successfully with price!');
              modal.style.display = 'none';
              fetchApplications();
          } else {
              alert('Error updating status: ' + data.message);
          }
      } catch (error) {
          console.error('Error updating status with price:', error);
          alert('Error updating status.');
      }
  }

  // Filter applications
  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filter = button.getAttribute('data-filter');

          let filteredApplications = allApplications;
          if (filter !== 'all') {
              filteredApplications = allApplications.filter(app => {
                  if (filter === 'pending') return app.status === 'pending';
                  if (filter === 'processing') return app.status === 'processing';
                  if (filter === 'verified') return app.status === 'approved';
                  return true;
              });
          }
          displayApplications(filteredApplications);
      });
  });

  // Event listeners
  closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      currentApplication = null;
  });

  // Logout functionality
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
      logoutButton.addEventListener("click", async function(e) {
          e.preventDefault();
          try {
              const response = await fetch('/api/supervisor/logout', {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' }
              });
              const data = await response.json();
              if (data.success) {
                  window.location.href = '/';
              } else {
                  alert('Failed to log out: ' + data.message);
              }
          } catch (error) {
              console.error('Error during logout:', error);
              alert('Error during logout.');
          }
      });
  }

  // Initial fetch
  fetchApplications();
});