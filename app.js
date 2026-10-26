const endpointGroups = [
  {
    name: 'user-auth',
    description: 'Firebase sign-in and account-session operations used by SWU-IFSS personnel.',
    endpoints: [
      endpoint('userEmailLogin', 'Sign in a provisioned user with institutional email and password', { email: 'user@swu.edu.ph', password: 'string', returnSecureToken: true }, { idToken: 'firebase-id-token', email: 'user@swu.edu.ph', refreshToken: 'firebase-refresh-token', expiresIn: '3600', localId: 'firebase-user-uid' }, 'public', { service: 'firebase-auth', path: '/v1/accounts:signInWithPassword' }),
      endpoint('userGoogleLogin', 'Exchange a Google identity credential for a Firebase session', { requestUri: 'https://your-app.example/login', postBody: 'id_token=GOOGLE_ID_TOKEN&providerId=google.com', returnIdpCredential: true, returnSecureToken: true }, { idToken: 'firebase-id-token', providerId: 'google.com', localId: 'firebase-user-uid' }, 'public', { service: 'firebase-auth', path: '/v1/accounts:signInWithIdp' }),
      endpoint('getCurrentAccount', 'Read the Firebase account represented by an ID token', { idToken: 'firebase-id-token' }, { users: [{ localId: 'firebase-user-uid', email: 'user@swu.edu.ph', emailVerified: true }] }, 'authenticated', { service: 'firebase-auth', path: '/v1/accounts:lookup' }),
      endpoint('changeOwnPassword', 'Change the signed-in Firebase account password', { idToken: 'firebase-id-token', password: 'NewStrongPassword123!', returnSecureToken: true }, { idToken: 'new-firebase-id-token', refreshToken: 'new-refresh-token', expiresIn: '3600' }, 'authenticated', { service: 'firebase-auth', path: '/v1/accounts:update' }),
      endpoint('sendPasswordResetOTP', 'Send the SWU-IFSS password-recovery OTP', { email: 'user@swu.edu.ph' }, { success: true }, 'public'),
      endpoint('verifyOTPAndResetPassword', 'Verify the recovery OTP and set a new password', { email: 'user@swu.edu.ph', otp: '123456', newPassword: 'NewStrongPassword123!' }, { success: true }, 'public'),
    ],
  },
  {
    name: 'admin-auth',
    description: 'Administrator sign-in uses Firebase Auth, followed by active-profile and role validation in SWU-IFSS.',
    endpoints: [
      endpoint('adminEmailLogin', 'Sign in a Registrar or Developer; the app then verifies the Firestore role and active status', { email: 'registrar@swu.edu.ph', password: 'string', returnSecureToken: true }, { idToken: 'firebase-id-token', email: 'registrar@swu.edu.ph', refreshToken: 'firebase-refresh-token', expiresIn: '3600', localId: 'firebase-user-uid' }, 'public', { service: 'firebase-auth', path: '/v1/accounts:signInWithPassword' }),
      endpoint('getAdminAccount', 'Inspect the authenticated Firebase account before SWU-IFSS applies role authorization', { idToken: 'firebase-id-token' }, { users: [{ localId: 'firebase-user-uid', email: 'registrar@swu.edu.ph', emailVerified: true }] }, 'authenticated', { service: 'firebase-auth', path: '/v1/accounts:lookup' }),
    ],
  },
  {
    name: 'diagnostics',
    description: 'Read-only checks for Cloud Functions and Firestore connectivity.',
    endpoints: [
      endpoint('testApiConnection', 'Test Cloud Function execution', {}, { ok: true, service: 'Firebase Cloud Functions', readOnly: true }, 'environment-tester'),
      endpoint('testDatabaseConnection', 'Test sanitized Firestore read connectivity', {}, { ok: true, readOnly: true, samples: [] }, 'environment-tester'),
    ],
  },
  {
    name: 'ai-configuration',
    description: 'Registrar-managed Gemini configuration and authenticated AI generation.',
    endpoints: [
      endpoint('getAiConfiguration', 'Read the active Gemini configuration (key is masked)', {}, { hasApiKey: true, keyHint: '••••1234', model: 'gemini-3.8-flash' }, 'registrar'),
      endpoint('saveAiConfiguration', 'Save or clear the Gemini API configuration', { model: 'gemini-3.8-flash', apiKey: '', clearApiKey: false }, { ok: true, model: 'gemini-3.8-flash' }, 'registrar'),
      endpoint('testAiConfiguration', 'Validate the configured Gemini model and API key', { model: 'gemini-3.8-flash', apiKey: '' }, { ok: true, model: 'gemini-3.8-flash' }, 'registrar'),
      endpoint('generateGeminiContent', 'Generate general AI content', { prompt: 'Summarize the scheduling conflicts.', systemInstruction: 'Be concise.', generationConfig: { temperature: 0.2 } }, { text: 'Generated response', model: 'gemini-3.8-flash' }, 'active-user-app-check'),
      endpoint('generateGeminiChatContent', 'Generate chatbot content with per-user rate limiting', { contents: [{ role: 'user', parts: [{ text: 'Which rooms are available?' }] }], systemInstruction: 'Answer using supplied scheduling context.' }, { text: 'Generated response', model: 'gemini-3.8-flash' }, 'active-user-app-check'),
    ],
  },
  {
    name: 'external-reservations',
    description: 'Public intake, tracking, editing, recommendations, and registrar decisions.',
    endpoints: [
      endpoint('submitExternalReservation', 'Submit an external room reservation request', { requesterName: 'Juan Dela Cruz', organization: 'Example Organization', email: 'juan@example.com', phone: '09123456789', title: 'Community Seminar', purpose: 'Training event', preferredDate: '2026-11-15', timeStart: '09:00', timeEnd: '12:00', expectedAttendees: 50 }, { success: true, requestId: 'request-id', trackingCode: 'ABC123' }, 'public-app-check'),
      endpoint('trackExternalReservation', 'Track a public external reservation', { trackingCode: 'ABC123', email: 'juan@example.com' }, { success: true, status: 'pending' }, 'public-app-check'),
      endpoint('requestExternalReservationEditOtp', 'Email an OTP before editing an external request', { trackingCode: 'ABC123', email: 'juan@example.com' }, { success: true }, 'public-app-check'),
      endpoint('verifyExternalReservationEditOtp', 'Verify the external-request edit OTP', { trackingCode: 'ABC123', email: 'juan@example.com', otp: '123456' }, { success: true, editToken: 'temporary-edit-token' }, 'public-app-check'),
      endpoint('updateExternalReservation', 'Update an external request using a verified edit token', { trackingCode: 'ABC123', editToken: 'temporary-edit-token', title: 'Updated Community Seminar', expectedAttendees: 60 }, { success: true }, 'public-app-check'),
      endpoint('authorizeExternalReservationView', 'Check whether a staff member may view an external request', { reservationId: 'reservation-id' }, { authorized: true }, 'active-assigned-staff'),
      endpoint('suggestExternalReservationRooms', 'Suggest rooms for an external reservation', { requestId: 'request-id' }, { success: true, suggestions: [] }, 'registrar'),
      endpoint('decideExternalReservation', 'Approve or reject an external reservation intake', { requestId: 'request-id', decision: 'approved', remarks: 'Requirements verified.' }, { success: true }, 'registrar'),
      endpoint('batchDeleteExternalReservations', 'Soft-delete up to 100 external requests', { requestIds: ['request-id-1', 'request-id-2'] }, { success: true, deletedCount: 2 }, 'registrar'),
    ],
  },
  {
    name: 'reservations-and-maintenance',
    description: 'Protected reservation cleanup and maintenance-report operations.',
    endpoints: [
      endpoint('deleteCompletedReservation', 'Permanently delete an owned or registrar-accessible reservation', { reservationId: 'reservation-id' }, { success: true }, 'owner-or-registrar'),
      endpoint('deleteOwnMaintenanceReports', 'Delete up to 100 maintenance reports owned by the caller', { reportIds: ['report-id-1', 'report-id-2'] }, { success: true, deletedCount: 2 }, 'owner'),
    ],
  },
  {
    name: 'user-administration',
    description: 'Privileged Firebase Authentication account management.',
    endpoints: [
      endpoint('deleteRegistrarAuthUser', 'Delete a registrar Authentication account', { uid: 'firebase-user-uid' }, { success: true }, 'developer'),
      endpoint('deleteOrphanStaffAuthUser', 'Delete an orphaned staff Authentication account', { uid: 'firebase-user-uid' }, { success: true }, 'registrar'),
      endpoint('deleteStaffAuthUser', 'Delete a staff Authentication account and related access', { uid: 'firebase-user-uid' }, { success: true }, 'registrar'),
      endpoint('setUserPasswordAdmin', 'Set a staff account password administratively', { uid: 'firebase-user-uid', password: 'NewStrongPassword123!' }, { success: true }, 'registrar'),
    ],
  },
  {
    name: 'account-email',
    description: 'Welcome, temporary-password, reset, and password-change email operations.',
    endpoints: [
      endpoint('sendRegistrarWelcomeEmail', 'Send registrar account credentials', { email: 'registrar@example.edu', displayName: 'Registrar User', temporaryPassword: 'TemporaryPassword123!' }, { success: true }, 'developer'),
      endpoint('sendStaffWelcomeEmail', 'Send staff account credentials', { email: 'staff@example.edu', displayName: 'Staff User', temporaryPassword: 'TemporaryPassword123!', role: 'dean' }, { success: true }, 'registrar'),
      endpoint('resendStaffTempPassword', 'Issue and send a new temporary staff password', { uid: 'firebase-user-uid' }, { success: true }, 'registrar'),
      endpoint('sendPasswordResetOTP', 'Send an OTP for password recovery', { email: 'user@example.edu' }, { success: true }, 'public'),
      endpoint('verifyOTPAndResetPassword', 'Verify an OTP and reset the account password', { email: 'user@example.edu', otp: '123456', newPassword: 'NewStrongPassword123!' }, { success: true }, 'public'),
      endpoint('sendPasswordChangedEmail', 'Send a password-change confirmation', { email: 'user@example.edu', displayName: 'System User' }, { success: true }, 'authenticated'),
    ],
  },
  {
    name: 'schedule-notifications',
    description: 'Email delivery for course scheduling access, approvals, and maintenance relocation.',
    endpoints: [
      endpoint('sendScheduleApprovalRequestEmail', 'Notify an approver about a plotted course schedule', { email: 'approver@example.edu', displayName: 'Approver', courseCode: 'ITE 367', sectionName: 'BSIT 4-A1', roomName: 'PH-101', reason: 'Room is outside the allocation.', actionLink: '/approvals' }, { success: true }, 'active-user'),
      endpoint('sendScheduleAccessGrantedEmail', 'Notify a dean that scheduling access was granted', { email: 'dean@example.edu', displayName: 'Dean', collegeName: 'CITE', schoolYearLabel: '2030-2031', semester: '1', schedulingType: 'regular', startDate: '2030-07-01', endDate: '2030-11-01' }, { success: true }, 'registrar'),
      endpoint('sendMaintenanceRelocationEmail', 'Notify affected personnel about a maintenance relocation', { email: 'faculty@example.edu', displayName: 'Faculty Member', courseCode: 'ITE 367', classDate: '2026-11-15', classTime: '09:00-10:30', originalRoom: 'PH-101', replacementRoom: 'TH-201', status: 'relocated', actionLink: '/course-scheduling' }, { success: true }, 'active-user'),
    ],
  },
  {
    name: 'reservation-notifications',
    description: 'Email delivery for approval progress, decisions, cancellations, and postponements.',
    endpoints: [
      endpoint('sendApprovalPendingEmail', 'Notify the next reservation approver', { email: 'approver@example.edu', displayName: 'Approver', title: 'Student Seminar', resType: 'Academic', venue: 'PH-101', levelNumber: 1, roleLabel: 'Dean', link: '/approvals' }, { success: true }, 'authenticated'),
      endpoint('sendReservationSubmittedEmail', 'Confirm that a reservation was submitted', { email: 'requestor@example.edu', displayName: 'Requestor', title: 'Student Seminar', resType: 'Academic', venue: 'PH-101', levelNumber: 1, roleLabel: 'Dean', link: '/approvals' }, { success: true }, 'authenticated'),
      endpoint('sendReservationDecisionEmail', 'Notify a requestor of approval or rejection', { email: 'requestor@example.edu', displayName: 'Requestor', title: 'Student Seminar', resType: 'Academic', venue: 'PH-101', status: 'approved', approverName: 'College Dean', approverRole: 'Dean', remarks: 'Approved', link: '/approvals' }, { success: true }, 'authenticated'),
      endpoint('sendReservationCancellationEmail', 'Notify prior approvers of an owner-cancelled reservation', { reservationId: 'reservation-id' }, { success: true, sent: 2 }, 'reservation-owner'),
      endpoint('sendPostponementEmail', 'Notify a requestor and provide a rescheduling link', { email: 'requestor@example.edu', displayName: 'Requestor', reservationTitle: 'Student Seminar', originalDate: '2026-11-15', venue: 'PH-101', reason: 'Scheduled room maintenance', rescheduleLink: '/reschedule/reservation-id' }, { success: true }, 'authenticated'),
    ],
  },
];

const schemas = [
  schema('Error', 'Standard error returned by Firebase callable or authentication operations.', [
    field('error', 'object', true, 'Error container.'),
    field('error.code', 'string', false, 'Machine-readable error code.'),
    field('error.message', 'string', true, 'Human-readable failure description.'),
    field('error.details', 'object | null', false, 'Optional validation or diagnostic details.'),
  ]),
  schema('Success', 'Shared success result used by operations that do not return a domain record.', [
    field('success', 'boolean', true, 'Indicates that the requested operation completed.'),
    field('message', 'string', false, 'Optional confirmation message.'),
  ]),
  schema('LoginRequest', 'Email and password credentials sent to Firebase Authentication.', [
    field('email', 'string(email)', true, 'Provisioned institutional account email.'),
    field('password', 'string', true, 'Account password.'),
    field('returnSecureToken', 'boolean', true, 'Requests ID and refresh tokens.'),
  ]),
  schema('LoginResponse', 'Firebase Authentication session returned after successful sign-in.', [
    field('idToken', 'string', true, 'Firebase ID token used to authorize protected requests.'),
    field('refreshToken', 'string', true, 'Token used to renew the session.'),
    field('expiresIn', 'string', true, 'ID-token lifetime in seconds.'),
    field('localId', 'string', true, 'Firebase Authentication user UID.'),
    field('email', 'string(email)', true, 'Authenticated account email.'),
  ]),
  schema('UserAccount', 'Authenticated Firebase account combined with the SWU-IFSS profile.', [
    field('uid', 'string', true, 'Firebase Authentication UID.'),
    field('email', 'string(email)', true, 'Institutional email address.'),
    field('displayName', 'string', false, 'Person or account display name.'),
    field('role', 'string', true, 'SWU-IFSS role such as registrar, dean, GSD, or developer.'),
    field('status', 'string', true, 'Account status; access requires active.'),
    field('department', 'string | null', false, 'Assigned college or department.'),
    field('mustSetPassword', 'boolean', false, 'Whether first-login password setup is required.'),
  ]),
  schema('PasswordResetRequest', 'OTP-based password recovery request.', [
    field('email', 'string(email)', true, 'Account email receiving the recovery OTP.'),
    field('otp', 'string', false, 'Verification code required during confirmation.'),
    field('newPassword', 'string', false, 'Replacement password required during confirmation.'),
  ]),
  schema('AiGenerationRequest', 'Content-generation input sent through the configured Gemini service.', [
    field('prompt', 'string', false, 'Direct user prompt.'),
    field('contents', 'array<object>', false, 'Gemini multi-turn content structure.'),
    field('systemInstruction', 'string', false, 'System behavior and response constraints.'),
    field('generationConfig', 'object', false, 'Temperature and output-token configuration.'),
  ]),
  schema('ExternalReservationRequest', 'Public facility-reservation intake submitted by an external organization.', [
    field('requesterName', 'string', true, 'Name of the external requestor.'),
    field('organization', 'string', true, 'Organization represented by the requestor.'),
    field('email', 'string(email)', true, 'Contact and tracking email.'),
    field('phone', 'string', true, 'Contact number.'),
    field('title', 'string', true, 'Event or activity title.'),
    field('purpose', 'string', true, 'Purpose of the facility request.'),
    field('preferredDate', 'string(date)', true, 'Requested activity date.'),
    field('timeStart', 'string(time)', true, 'Requested starting time.'),
    field('timeEnd', 'string(time)', true, 'Requested ending time.'),
    field('expectedAttendees', 'integer', true, 'Expected number of attendees.'),
  ]),
  schema('ExternalReservationTracking', 'Public tracking credentials and summarized reservation status.', [
    field('trackingCode', 'string', true, 'Generated booking reference.'),
    field('email', 'string(email)', true, 'Email used when submitting the request.'),
    field('status', 'string', false, 'Current workflow status.'),
    field('decisionRemarks', 'string | null', false, 'Latest approver remarks.'),
  ]),
  schema('ScheduleApprovalRequest', 'Request for approval when a plotted class uses a controlled or non-allocated room.', [
    field('courseCode', 'string', true, 'Course identifier.'),
    field('sectionName', 'string', true, 'Recipient section.'),
    field('roomName', 'string', true, 'Requested room.'),
    field('reason', 'string', true, 'Dean justification for using the room.'),
    field('approvalSubmissionId', 'string', false, 'Groups related plotted schedule entries.'),
    field('actionLink', 'string', false, 'Approval-management route.'),
  ]),
  schema('MaintenanceRelocationNotice', 'Email notification describing a class relocation or recovery decision.', [
    field('email', 'string(email)', true, 'Notification recipient.'),
    field('courseCode', 'string', true, 'Affected course.'),
    field('classDate', 'string(date)', true, 'Affected class date.'),
    field('classTime', 'string', true, 'Affected time range.'),
    field('originalRoom', 'string', true, 'Room placed under maintenance.'),
    field('replacementRoom', 'string | null', false, 'Approved temporary room.'),
    field('status', 'string', true, 'Relocation, asynchronous, pending-selection, or restored state.'),
  ]),
  schema('ReservationNotification', 'Shared reservation email payload for submission, approval, rejection, or postponement.', [
    field('email', 'string(email)', true, 'Notification recipient.'),
    field('displayName', 'string', false, 'Recipient display name.'),
    field('title', 'string', true, 'Reservation or activity title.'),
    field('resType', 'string', false, 'Academic, non-academic, or external reservation type.'),
    field('venue', 'string', false, 'Designated room and building.'),
    field('status', 'string', false, 'Current approval or decision status.'),
    field('link', 'string', false, 'Relevant application route.'),
  ]),
];

function schema(name, description, fields) {
  return { name, description, fields };
}

function field(name, type, required, description) {
  return { name, type, required, description };
}

function endpoint(name, description, request, response, access, options = {}) {
  return { name, path: options.path || `/${name}`, description, request, response, access, service: options.service || 'callable' };
}

const accessLabels = {
  public: 'Public callable. Rate limits and input validation still apply.',
  'public-app-check': 'Public callable requiring a valid Firebase App Check token when enforcement is enabled.',
  authenticated: 'Requires a signed-in Firebase user ID token.',
  'active-user': 'Requires a signed-in, active SWU-IFSS user.',
  'active-user-app-check': 'Requires an active SWU-IFSS user, Firebase ID token, and App Check token. Chat calls are rate-limited.',
  registrar: 'Restricted to an authenticated Registrar (Developer access may also apply where implemented).',
  developer: 'Restricted to an authenticated Developer account.',
  'environment-tester': 'Restricted to an authorized environment tester (Registrar or Developer).',
  'active-assigned-staff': 'Requires active staff assigned to the request workflow, its intake registrar, or a privileged role.',
  'owner-or-registrar': 'Restricted to the record owner, Registrar, or Developer.',
  owner: 'Restricted to the authenticated owner of every selected record.',
  'reservation-owner': 'Restricted to the reservation requestor after the reservation has been cancelled.',
};

const publicAccess = new Set(['public', 'public-app-check']);
const groupsContainer = document.querySelector('#apiGroups');
const endpointTemplate = document.querySelector('#endpointTemplate');
const searchInput = document.querySelector('#searchInput');
const baseUrlInput = document.querySelector('#baseUrl');
const firebaseApiKeyInput = document.querySelector('#firebaseApiKey');
const authorizeButton = document.querySelector('#authorizeButton');
const authorizationDialog = document.querySelector('#authorizationDialog');
const authTokenInput = document.querySelector('#authToken');
const appCheckTokenInput = document.querySelector('#appCheckToken');

let authToken = '';
let appCheckToken = '';

function renderSchemas() {
  const container = document.querySelector('#schemasContent');
  container.replaceChildren();
  schemas.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'schema-card';
    card.innerHTML = `
      <button class="schema-summary" type="button" aria-expanded="false">
        <span class="chevron" aria-hidden="true">⌃</span>
        <strong>${escapeHtml(item.name)}</strong>
        <span class="schema-expand">Expand</span>
        <code>object</code>
      </button>
      <div class="schema-details" hidden>
        <p class="schema-description">${escapeHtml(item.description)}</p>
        <table class="schema-table">
          <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>${item.fields.map((property) => `
            <tr>
              <td>${escapeHtml(property.name)}${property.required ? '<span class="schema-required">required</span>' : ''}</td>
              <td><span class="schema-type">${escapeHtml(property.type)}</span></td>
              <td>${escapeHtml(property.description)}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>`;
    const summary = card.querySelector('.schema-summary');
    const details = card.querySelector('.schema-details');
    summary.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      details.hidden = !open;
      summary.setAttribute('aria-expanded', String(open));
      card.querySelector('.schema-expand').textContent = open ? 'Collapse' : 'Expand';
    });
    container.append(card);
  });
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function render(filter = '') {
  const query = filter.trim().toLowerCase();
  groupsContainer.replaceChildren();
  let rendered = 0;

  endpointGroups.forEach((group) => {
    const matches = group.endpoints.filter((item) =>
      [group.name, group.description, item.name, item.path, item.description]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
    if (!matches.length) return;

    const section = document.createElement('section');
    section.className = 'api-group';
    section.innerHTML = `
      <button class="group-heading" type="button" aria-expanded="true">
        <h2>${escapeHtml(group.name)}</h2>
        <p>${escapeHtml(group.description)}</p>
        <span class="chevron" aria-hidden="true">⌃</span>
      </button>
      <div class="group-endpoints"></div>`;
    const endpointContainer = section.querySelector('.group-endpoints');
    matches.forEach((item) => endpointContainer.append(createEndpoint(item)));
    section.querySelector('.group-heading').addEventListener('click', (event) => {
      const collapsed = section.classList.toggle('is-collapsed');
      endpointContainer.hidden = collapsed;
      event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    });
    groupsContainer.append(section);
    rendered += matches.length;
  });

  if (!rendered) {
    groupsContainer.innerHTML = '<div class="empty-state"><strong>No endpoints found.</strong><br />Try a different name, path, or category.</div>';
  }
}

function createEndpoint(item) {
  const fragment = endpointTemplate.content.cloneNode(true);
  const article = fragment.querySelector('.endpoint');
  const summary = fragment.querySelector('.endpoint__summary');
  const details = fragment.querySelector('.endpoint__details');
  const requestCode = fragment.querySelector('.request-example');
  const responseCode = fragment.querySelector('.response-example');
  const editor = fragment.querySelector('.request-editor');
  const actions = fragment.querySelector('.execute-actions');
  const tryButton = fragment.querySelector('.try-button');
  const liveResponse = fragment.querySelector('.live-response');

  if (publicAccess.has(item.access)) article.classList.add('is-public');
  fragment.querySelector('.endpoint__path').textContent = item.path;
  fragment.querySelector('.endpoint__description').textContent = item.description;
  fragment.querySelector('.endpoint__access').textContent = accessLabels[item.access] || item.access;
  requestCode.textContent = pretty(item.service === 'firebase-auth' ? item.request : { data: item.request });
  responseCode.textContent = pretty(item.service === 'firebase-auth' ? item.response : { result: item.response });
  editor.value = pretty(item.request);

  summary.addEventListener('click', () => {
    const open = article.classList.toggle('is-open');
    details.hidden = !open;
    summary.setAttribute('aria-expanded', String(open));
  });

  tryButton.addEventListener('click', () => {
    requestCode.parentElement.hidden = true;
    editor.hidden = false;
    actions.hidden = false;
    tryButton.disabled = true;
    editor.focus();
  });

  fragment.querySelector('.cancel-button').addEventListener('click', () => {
    editor.value = pretty(item.request);
    editor.hidden = true;
    actions.hidden = true;
    requestCode.parentElement.hidden = false;
    tryButton.disabled = false;
  });

  fragment.querySelector('.execute-button').addEventListener('click', async (event) => {
    const executeButton = event.currentTarget;
    try {
      const payload = JSON.parse(editor.value || '{}');
      executeButton.disabled = true;
      executeButton.textContent = 'Executing…';
      const startedAt = performance.now();
      const isFirebaseAuth = item.service === 'firebase-auth';
      const apiKey = firebaseApiKeyInput.value.trim();
      if (isFirebaseAuth && !apiKey) throw new Error('Enter the Firebase Web API key above before executing an authentication endpoint.');
      const targetUrl = isFirebaseAuth
        ? `https://identitytoolkit.googleapis.com${item.path}?key=${encodeURIComponent(apiKey)}`
        : `${baseUrlInput.value.trim().replace(/\/$/, '')}/${item.name}`;
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...(appCheckToken ? { 'X-Firebase-AppCheck': appCheckToken } : {}),
        },
        body: JSON.stringify(isFirebaseAuth ? payload : { data: payload }),
      });
      const responseText = await response.text();
      let body;
      try { body = JSON.parse(responseText); } catch { body = responseText; }
      showLiveResponse(liveResponse, `${response.status} ${response.statusText} · ${Math.round(performance.now() - startedAt)} ms`, body);
    } catch (error) {
      showLiveResponse(liveResponse, 'Request was not sent', { error: error.message });
    } finally {
      executeButton.disabled = false;
      executeButton.textContent = 'Execute';
    }
  });

  return fragment;
}

function showLiveResponse(container, meta, body) {
  container.hidden = false;
  container.querySelector('.response-meta').textContent = meta;
  container.querySelector('code').textContent = typeof body === 'string' ? body : pretty(body);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

searchInput.addEventListener('input', () => render(searchInput.value));
document.querySelector('#schemasToggle').addEventListener('click', (event) => {
  const section = document.querySelector('#schemasSection');
  const content = document.querySelector('#schemasContent');
  const collapsed = section.classList.toggle('is-collapsed');
  content.hidden = collapsed;
  event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
});
authorizeButton.addEventListener('click', () => authorizationDialog.showModal());
document.querySelector('#clearTokens').addEventListener('click', () => {
  authTokenInput.value = '';
  appCheckTokenInput.value = '';
  firebaseApiKeyInput.value = '';
  authToken = '';
  appCheckToken = '';
  authorizeButton.classList.remove('has-token');
});
document.querySelector('#saveTokens').addEventListener('click', () => {
  authToken = authTokenInput.value.trim().replace(/^Bearer\s+/i, '');
  appCheckToken = appCheckTokenInput.value.trim();
  authorizeButton.classList.toggle('has-token', Boolean(authToken || appCheckToken || firebaseApiKeyInput.value.trim()));
});

render();
renderSchemas();
