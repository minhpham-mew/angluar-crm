You are an expert full-stack developer specializing in Angular and Appwrite, with deep expertise in enterprise application architecture using NgRx. Your task is to generate a complete, production-ready, multi-tenant CRM application based on the following detailed specifications.  
**1\. Technology Stack**

* **Frontend:** Angular 17+ (using standalone components).  
* **State Management:** NgRx (Store, Effects, Entity, Store Devtools).  
* **Backend:** Appwrite Web SDK.  
* **UI/Styling:** Tailwind CSS. Use a clean, modern, and professional design with a focus on great UX.

**2\. Appwrite Backend Configuration**

* **Project:** Create a new Appwrite project.  
* **Database:** Create a database with the ID crm\_db.  
* **Collections:** contacts, meetings, and deals with document-level permissions based on tenantId.  
* **Authentication:** Enable "Email/Password" provider. User prefs must be populated with tenantId, role, and permissions.

**3\. Angular Frontend Application (Enterprise NgRx Architecture)**  
**Note:** All component templates **must** use Angular's new built-in control flow syntax (@if, @for, @switch) instead of structural directives (\*ngIf, \*ngFor, NgSwitch).  
**3.1. Project Structure & Core Setup**

* **Modular Structure:** Generate a structure with directories for core, auth, shared, and feature modules under a features directory (e.g., /features/contacts, /features/deals).  
* **Environment Config:** Use Angular's environment.ts files to store Appwrite credentials (Project ID, API Endpoint). Do not hardcode these values.  
* **Typed Models:** Create a core/models directory. Inside, define TypeScript interface files for all data entities (contact.model.ts, deal.model.ts, user.model.ts, etc.) to ensure strong type safety.  
* **NgRx Setup:** Install and configure @ngrx/store, @ngrx/effects, @ngrx/entity, and @ngrx/store-devtools.  
* **appwrite.service.ts:** Located in core/services, this is a pure API client injected only into NgRx Effects.

**3.2. NgRx State Management**

* **Root State:** Define a root AppState interface.  
* **Auth State (auth/store):** Manages user, authentication status, and errors. Effects handle API calls for login/logout and navigate to /dashboard on success.  
* **Feature States (e.g., features/contacts/store):** Use @ngrx/entity for Contacts, Deals, Meetings, and Users. State includes { ids, entities, loading, error }. Actions, reducers, and selectors should be created for all CRUD operations.  
* **Notifications State (shared/store/notifications):**  
  * **Purpose:** To manage global toast/snackbar messages.  
  * **State:** { notifications: Notification\[\] } where Notification has message, type ('success' | 'error'), and an id.  
  * **Actions:** addNotification, removeNotification.  
  * **Effects:** All feature effects (e.g., ContactsEffects) should dispatch addNotification on successful or failed API calls (e.g., "Contact created successfully\!" or "Error: Could not save contact.").

**3.3. Components & UX**

* **Form Handling:** All forms **must** use Angular's **Reactive Forms** with robust validation (e.g., Validators.required, Validators.email) and display user-friendly validation messages.  
* **AppComponent:** The root component. It should contain the \<router-outlet\> and a global notifications component (e.g., app-toast-container) that subscribes to the notifications store and displays toast messages.  
* **DashboardLayoutComponent:** The main layout for authenticated users, with a sidebar for navigation and a main content area.  
* **DashboardSummaryComponent (New):**  
  * The default view for the /dashboard route.  
  * Displays a summary of key metrics: a list of upcoming meetings, a chart or summary of the deals pipeline, and a list of recently added contacts. It will get this data by selecting from the relevant feature stores.  
* **Feature Components (e.g., ContactsComponent, DealsComponent):**  
  * In ngOnInit, dispatch the load... action for the feature.  
  * Include a **search input** to filter the list. The filtering logic should be implemented within NgRx selectors for performance.  
  * Use @if to show a loading spinner while data is being fetched.  
  * Use @for to render the data list, including a track function.  
  * **Empty State:** Use an @if block to check if the data array is empty. If it is, display a user-friendly message with a call-to-action button (e.g., "No contacts found. \[Create New Contact\]").

**3.4. Routing & Guards**

* **Routing:**  
  * /login \-\> LoginComponent  
  * /dashboard \-\> DashboardLayoutComponent with child routes:  
    * Path: '' (empty) \-\> DashboardSummaryComponent (default view)  
    * Path: contacts \-\> ContactsComponent  
    * Path: deals \-\> DealsComponent  
    * ...and so on for other features.  
* **Guards:** AuthGuard and SuperAdminGuard will be connected to the NgRx store to check authentication status and user roles.

Generate all necessary code files for this complete enterprise-grade NgRx architecture. The code should be clean, strongly-typed, and follow all specified best practices.
