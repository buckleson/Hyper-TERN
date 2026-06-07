import type { ParentComponent } from 'solid-js';

const AuthLayout: ParentComponent = (props) => {
  return (
    <div class="auth-layout">
      <div class="auth-card">
        <div class="auth-logo">
          <a href="https://hyper-tern.build" class="auth-logo__link">
            <img src="/hyper-tern-logo.png" alt="Hyper-Tern" class="auth-logo__img" />
          </a>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default AuthLayout;
