import { Component, HostListener, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


declare var bootstrap: any;

export interface Role {
  roleId: string;
  roleName: string;
}


@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrl: './manage-users.component.css',
    standalone: false
})

export class ManageUsersComponent implements OnInit {
  
      users: any[] = [];
      isCreatingUser: boolean = false; // Controls form visibility
      user = {
        userId : '', 
        fullName: '',
        username: '',
        Email:'',
        role: '',
        usertype: '',
        Phonenumber: '',
        facultyName: '',
      };
      selectedrole : string = '';
      roles: string[] = ['Admin', 'Student', 'Teacher', 'Finance'];
      selectedUser: any = null;

      showModal = false;
      isEditingUser = false;
      isEditMode = false;
      students: any[] = [];
      faculties:any[] = [];
      selectedFacultyId: number | null = null;
      allRoles: { roleId: string; roleName: string; }[] = [];
      actionsDropdownUser: any | null = null;
      showAssignRoles: boolean = false;
      userRoles: Role[] = [];
      selectedRoleToAssign: Role | null = null;
      actionsDropdownUserId: string | null = null;
      selectedUserForRoles: any = null;

      

      constructor(private adminService: AdminService, private router: Router, private toastr: ToastrService) {}

      ngOnInit() {
        this.loadUsers();
        this.loadFaculties();
        this.loadRoles();
      }

      loadUsers() {
        this.adminService.getAllUsers().subscribe((data: any) => {
          this.users = data;
        });
      }
      openModal() {  
        this.showModal = true;
      }

      onRoleChange() {
        this.selectedFacultyId = null;     // reset faculty filter
        this.loadUsersByRole();          // reload users for the new role
      }

      onFacultyChange() {
        if (this.selectedFacultyId !== null) {
          this.loadStudentsForFaculty(this.selectedFacultyId as number);
        } else {
          this.loadUsersByRole(); // show all students if “All Faculties” selected
        }
      }

      loadUsersById(userId: string) {
        this.adminService.getAllUsersById(userId).subscribe(
          data => {
            this.selectedUser = data;
            this.isEditingUser = false;       // ensure we start in view‐only mode
            this.showModal = true;  
          },
          error => {
            console.error('Error fetching user details:', error);
            this.toastr.error("Error fetching user details");
          });
      } 

      loadUsersByRole() { 
        if (!this.selectedrole) {
          // If no role is selected, fetch all users
          this.adminService.getAllUsers().subscribe((data: any) => {
            this.users = data || [];
            this.students = [];
          });
        } else {
          // Fetch users based on selected role
          this.adminService.getAllUsersByRole(this.selectedrole).subscribe((data: any) => {
            this.users = data || [];
          });
        }
      }

      loadFaculties() {
        this.adminService.getFaculties().subscribe({
          next: (fac) => (this.faculties = fac),
          error: () => this.toastr.error('Failed to load faculties')
        });
      }

        loadStudentsForFaculty(id: number) {
        this.adminService.getStudentsByFaculty(id).subscribe({
          next: students => {
            this.students = students;
            this.users = students;
          },
          error: () => this.toastr.error('No students found for that faculty.')
        });
      }


      onSubmit() {
        this.adminService.createUser(this.user).subscribe(() => {
          this.router.navigate(['/manage-users']);
          this.isCreatingUser = false; // Hide the form
          this.toastr.success("User Created");
          this.loadUsers(); // Reload the list
              
        }, 
        (error) => {
          
          console.log(error);
          this.toastr.error("Error Creating user");
          
        });
      }

      onDeleteUser(userId: string) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'No, cancel'
          }).then((result) => {
            if (result.isConfirmed) {
              this.adminService.deleteUser(userId)
                .pipe(
                  catchError((error) => {
                    console.error('Error deleting user:', error);
                    this.toastr.error('Failed to delete user.', 'Error');
                    return of(null);
                  })
                )
                .subscribe((response) => {
                  if (response) {
                    // Remove from the local array
                    this.users = this.users.filter(user => user.userId !== userId);
                    this.toastr.success('User deleted successfully.', 'Deleted');
                    this.router.navigate(['/manage-users']);
                  }
                });
            }
            // if dismissed, do nothing
          });
        }

      editMode() {
        this.isEditingUser = true;
      }

      // 3️⃣ Submit updated user
      submitUpdatedUser() {
        this.adminService.updateUserInfo(this.selectedUser.userId,this.selectedUser).subscribe(
          () => {
            this.loadUsers();                // refresh list
            this.closeModal();
            this.toastr.success('User Updated');
          },
          err => console.log('Error updating user: ' + err.error)
        );
      }
      
      closeModal() {
        this.showModal = false;
        this.selectedUser = null;
        this.isEditingUser = false;
      }

      //     User Roles   //

      openActionsDropdown(user: any) {
        console.log('openActionsDropdown', user?.userId);
      // toggle by userId
      if (!user || !user.userId) {
        this.actionsDropdownUserId = null;
        return;
      }
      this.actionsDropdownUserId = this.actionsDropdownUserId === user.userId ? null : user.userId;
    }

    // optional: close dropdowns when user clicks anywhere outside
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      // clicking anywhere that isn't stopped will reach here and close the dropdown
      this.actionsDropdownUserId = null;
    }

    loadRoles() {
      if ((this.adminService as any).getAllRoles) {
        (this.adminService as any).getAllRoles().subscribe({
          next: (data: any) => {
            if (!data) { this.allRoles = []; return; }
            // If data items are objects with roleName, keep them; otherwise try to map
            if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
              this.allRoles = data.map((r: any) => ({
                roleId: r.roleId ?? r.id ?? '',
                roleName: r.roleName ?? r.name ?? String(r)
              }));
            } else {
              // fallback: server returned strings
              this.allRoles = (data as string[]).map((n: string, i: number) => ({ roleId: String(i), roleName: n }));
            }
          },
          error: () => {
            // fallback to local list if you maintain one
            this.allRoles = (this.roles || []).map(r => ({ roleId: r, roleName: r }));
          }
        });
      } else {
        this.allRoles = (this.roles || []).map(r => ({ roleId: r, roleName: r }));
      }
    }

      // --- openAssignRolesModal(user) ---
   openAssignRolesModal(user: any) {
      this.actionsDropdownUserId = null;
      if (!user?.userId) return;

      if (user && user.isActive === false) {
        this.toastr.info('Cannot assign roles to a disabled user. Enable the user first.');
        return;
      }


      // get freshest user
      this.adminService.getAllUsersById(user.userId).subscribe({
        next: (u: any) => {
          this.selectedUserForRoles = u;
          this.selectedRoleToAssign = null;

          // ensure we have latest available role catalog; optional but safer
          this.loadRoles();

          // load roles assigned to user (server may return string[] of names)
          this.adminService.getUserRoles(user.userId).subscribe({
            next: (roles: string[] | Role[]) => {
              // If server returns objects already (roleId present) use them,
              // otherwise map names -> objects using allRoles lookup.
              if (Array.isArray(roles) && roles.length > 0 && typeof roles[0] === 'object' && (roles as any)[0].roleId !== undefined) {
                this.userRoles = roles as Role[];
              } else {
                // roles is probably string[]
                this.userRoles = this.mapRoleNamesToObjects(roles as string[]);
              }

              this.showAssignRoles = true;
              setTimeout(() => document.getElementById('roleSelect')?.focus(), 0);
            },
            error: (err: any) => {
              console.error('Failed to fetch user roles', err);
              // fallback: map whatever is in user payload (u.roles) or empty
              this.userRoles = this.mapRoleNamesToObjects(u?.roles);
              this.showAssignRoles = true;
            }
          });
        },
        error: (err: any) => {
          console.error('Failed to fetch user for role assignment', err);
          this.toastr.error('Failed to fetch selected user for role assignment');
        }
      });
    }


    // close assign roles
    closeAssignRolesModal() {
      this.showAssignRoles = false;
      this.selectedUserForRoles = null;
      this.userRoles = [];
      this.selectedRoleToAssign = null;
    }

    // assign role - use selectedUserForRoles.userId
    assignRole() {
     if (!this.selectedUserForRoles || !this.selectedRoleToAssign) return;

      const roleName = this.selectedRoleToAssign.roleName; // ✅ works now
      const roleId = this.selectedRoleToAssign.roleId;
      console.log(this.selectedRoleToAssign.roleName);

    this.adminService.assignRoles(this.selectedUserForRoles.userId, roleName)
      .subscribe({
        next: () => {
          this.toastr.success(`Role "${roleName}" assigned`);
          this.selectedRoleToAssign = null;
          this.refreshUserRoles(); // re-fetch from server for single source of truth
        },
        error: (err: any) => {
          console.error('Error assigning role', err);
          this.toastr.error('Failed to assign role');
        }
      });
  }

    // remove role - use selectedUserForRoles.userId
// remove by roleId
removeRoleById(roleId: string, roleName?: string) {
  if (!this.selectedUserForRoles) return;

  const display = roleName ?? roleId;
  Swal.fire({
    title: `Remove role "${display}"?`,
    text: `This will remove role "${display}" from ${this.selectedUserForRoles.fullName || this.selectedUserForRoles.username}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (!result.isConfirmed) return;

    this.adminService.removeUserRole(this.selectedUserForRoles.userId, roleId).subscribe({
      next: () => {
        this.toastr.success(`Role "${display}" removed`);
        // remove locally by id
        this.userRoles = this.userRoles.filter(r => r.roleId !== roleId);
        // optionally re-fetch authoritative list:
        // this.refreshUserRoles();
      },
      error: (err: any) => {
        console.error('Error removing role', err);
        const msg = err?.error?.message || err?.message || 'Failed to remove role';
        this.toastr.error(msg, 'Error removing role');
      }
    });
  });
}

// convenience wrapper if the template still calls removeRole(r) with a Role object
removeRole(objOrName: Role | string) {
  if (!objOrName) return;
  if (typeof objOrName === 'string') {
    // string fallback — find id & call removeRoleById
    const match = this.allRoles.find(a => a.roleName === objOrName);
    if (!match) {
      this.toastr.error(`Role id for "${objOrName}" not found.`, 'Error');
      return;
    }
    this.removeRoleById(match.roleId, objOrName);
  } else {
    this.removeRoleById(objOrName.roleId, objOrName.roleName);
  }
}


    // refresh userRoles after changes
    private refreshUserRoles() {
      const target = this.selectedUserForRoles || this.selectedUser;
      if (!target) return;

      this.adminService.getUserRoles(target.userId).subscribe({
        next: (roles: string[] | Role[]) => {
          if (Array.isArray(roles) && roles.length > 0 && typeof roles[0] === 'object' && (roles as any)[0].roleId !== undefined) {
            this.userRoles = roles as Role[];
          } else {
            this.userRoles = this.mapRoleNamesToObjects(roles as string[]);
          }
        },
        error: (err: any) => {
          console.error('Failed to refresh user roles', err);
          // fallback to payload in user object or empty
          this.adminService.getAllUsersById(target.userId).subscribe({
            next: (u: any) => this.userRoles = this.mapRoleNamesToObjects(u?.roles),
            error: () => this.userRoles = []
          });
        }
      });
}


      // Returns roles that are not yet assigned
   assignableRoles(): Role[] {
      if (!this.allRoles) return [];
      const assignedNames = (this.userRoles || []).map(x => x.roleName);
      return this.allRoles.filter(r => !assignedNames.includes(r.roleName));
    }


      // map an array of roleName strings to Role objects (roleId may be empty if server only returned names)
    private mapRoleNamesToObjects(roleNames: string[] | undefined | null): Role[] {
      const names = roleNames || [];
      return names.map(name => {
        const match = this.allRoles.find(a => a.roleName === name);
        return {
          roleId: match?.roleId ?? '', // empty id if we don't know it
          roleName: name
        };
      });
    }

    // ask for confirmation then call API to disable/enable
    toggleUserActive(user: any) {
      if (!user?.userId) return;

      const targetAction = user.isActive ? 'Disable' : 'Enable';
      const confirmText = user.isActive
        ? `This will disable ${user.fullName || user.username}. They will not be able to log in. Continue?`
        : `This will enable ${user.fullName || user.username}. Continue?`;

      Swal.fire({
        title: `${targetAction} user?`,
        text: confirmText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: targetAction,
      }).then(result => {
        if (!result.isConfirmed) return;

        // call API
        this.adminService.setUserActiveState(user.userId, !user.isActive).subscribe({
          next: () => {
            // update UI locally
            user.isActive = !user.isActive;
            this.toastr.success(`${targetAction}d user successfully.`);
            // optionally refresh list:
            // this.loadUsers();
          },
          error: (err) => {
            console.error(`${targetAction} user failed`, err);
            const msg = err?.error?.message || err?.message || 'Failed to change user state';
            this.toastr.error(msg, 'Error');
          }
        });
      });
    }



  
}
