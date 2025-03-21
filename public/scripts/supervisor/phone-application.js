document.addEventListener('DOMContentLoaded', function() {
    const applicationsTable = document.getElementById('applications-body');
    const statusFilter = document.getElementById('status-filter');
    const modal = document.getElementById('application-details');
    const modalContent = document.getElementById('application-details-content');
    const closeBtn = document.querySelector('.close');
    
    let currentApplicationId = null;
    let applications = [];
    
    // Load applications
    async function loadApplications() {
      try {
        const response = await fetch('/api/supervisor/phone-applications');
        const data = await response.json();
        
        if (data.success) {
          applications = data.applications;
          renderApplications();
        } else {
          alert('Error loading applications');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to load applications');
      }
    }
    
    // Render applications based on current filter
    function renderApplications() {
      const filter = statusFilter.value;
      
      // Filter applications if needed
      const filteredApplications = filter === 'all' 
        ? applications 
        : applications.filter(app => app.status === filter);
      
      // Clear table
      applicationsTable.innerHTML = '';
      
      if (filteredApplications.length === 0) {
        applicationsTable.innerHTML = `
          <tr>
            <td colspan="7" class="no-data">No applications found</td>
          </tr>
        `;
        return;
      }
      
      // Add applications to table
      filteredApplications.forEach(app => {
        const date = new Date(app.created_at).toLocaleDateString();
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${app.id}</td>
          <td>${app.brand}</td>
          <td>${app.model}</td>
          <td>${app.ram}GB / ${app.rom}GB</td>
          <td>${date}</td>
          <td><span class="status-badge ${app.status}">${app.status}</span></td>
          <td>
            <button class="view-btn" data-id="${app.id}">View Details</button>
          </td>
        `;
        
        applicationsTable.appendChild(row);
      });
      
      // Add event listeners to view buttons
      document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.getAttribute('data-id');
          openApplicationDetails(id);
        });
      });
    }
    
    async function openApplicationDetails(id) {
        try {
          const response = await fetch(`/api/phone-applications/${id}`);
          const data = await response.json();
          
          if (data.success) {
            const app = data.application;
            currentApplicationId = app.id;
            
            // Format the details
            modalContent.innerHTML = `
              <div class="detail-section">
                <h3>Device Information</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Brand:</span>
                    <span class="value">${app.brand}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Model:</span>
                    <span class="value">${app.model}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">RAM:</span>
                    <span class="value">${app.ram}GB</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Storage:</span>
                    <span class="value">${app.rom}GB</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Processor:</span>
                    <span class="value">${app.processor}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Network:</span>
                    <span class="value">${app.network}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Size:</span>
                    <span class="value">${app.size || 'N/A'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Weight:</span>
                    <span class="value">${app.weight || 'N/A'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Device Age:</span>
                    <span class="value">${app.device_age}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Device Condition</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Switching On:</span>
                    <span class="value ${app.switching_on === 'yes' ? 'good' : 'bad'}">${app.switching_on}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Phone Calls:</span>
                    <span class="value ${app.phone_calls === 'yes' ? 'good' : 'bad'}">${app.phone_calls}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Cameras Working:</span>
                    <span class="value ${app.cameras_working === 'yes' ? 'good' : 'bad'}">${app.cameras_working}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Battery Issues:</span>
                    <span class="value ${app.battery_issues === 'no' ? 'good' : 'bad'}">${app.battery_issues}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Physically Damaged:</span>
                    <span class="value ${app.physically_damaged === 'no' ? 'good' : 'bad'}">${app.physically_damaged}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Sound Issues:</span>
                    <span class="value ${app.sound_issues === 'no' ? 'good' : 'bad'}">${app.sound_issues}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Contact Information</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="label">Location:</span>
                    <span class="value">${app.location}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Email:</span>
                    <span class="value">${app.email}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Phone:</span>
                    <span class="value">${app.phone}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Device Image</h3>
                <div class="detail-image">
                  <img src="${app.image_path}" alt="Device Image" style="max-width: 100%; height: auto;">
                </div>
              </div>
              
              <div class="detail-section">
                <h3>Application Status</h3>
                <div class="detail-status">
                  Current Status: <span class="status-badge ${app.status}">${app.status}</span>
                </div>
              </div>
            `;
            
            // Update status buttons to reflect current status
            document.querySelectorAll('.status-btn').forEach(btn => {
              const status = btn.getAttribute('data-status');
              btn.classList.toggle('active', status === app.status);
            });
            
            // Show the modal
            modal.style.display = 'block';
          } else {
            alert('Error loading application details');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to load application details');
        }
      }
    
    // Update application status
    async function updateApplicationStatus(id, status) {
      try {
        const response = await fetch(`/api/supervisor/phone-applications/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Update local data and refresh the table
          const index = applications.findIndex(app => app.id === parseInt(id));
          if (index !== -1) {
            applications[index].status = status;
          }
          
          renderApplications();
          
          // Update status buttons
          document.querySelectorAll('.status-btn').forEach(btn => {
            const btnStatus = btn.getAttribute('data-status');
            btn.classList.toggle('active', btnStatus === status);
          });
          
          // Update the status in modal
          const statusElement = document.querySelector('.detail-status .status-badge');
          if (statusElement) {
            statusElement.className = `status-badge ${status}`;
            statusElement.textContent = status;
          }
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to update status');
      }
    }
    
    // Event Listeners
    if (statusFilter) {
      statusFilter.addEventListener('change', renderApplications);
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Add event listeners to status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const status = this.getAttribute('data-status');
        if (currentApplicationId) {
          updateApplicationStatus(currentApplicationId, status);
        }
      });
    });
    
    // Load applications on page load
    loadApplications();
  });