use std::net::SocketAddr;

use axum::{Router, routing::get};
use color_eyre::eyre::{self, Context};
use tokio::net::TcpListener;
use tracing::instrument;
use tracing_error::ErrorLayer;
use tracing_subscriber::{EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

mod error;

#[tokio::main]
async fn main() -> eyre::Result<()> {
    color_eyre::install()?;

    tracing_subscriber::registry()
        .with(ErrorLayer::default())
        .with(
            EnvFilter::try_from_default_env()
                .or_else(|_| EnvFilter::try_new("info"))
                .unwrap(),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new().route("/", get(index));

    let listen_addr: SocketAddr = ([127, 0, 0, 1], 8080).into();
    let listener = TcpListener::bind(listen_addr)
        .await
        .wrap_err_with(|| format!("Failed to open listener on {}", listen_addr))?;
    axum::serve(listener, app.into_make_service())
        .await
        .wrap_err("Failed to serve make service")
}

#[instrument]
async fn index() -> Result<(), error::Error> {
    Ok(())
}
