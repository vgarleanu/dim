#![feature(rustc_private)]
#![feature(custom_attribute)]
#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate serde;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate diesel_migrations;

use std::sync::atomic::{AtomicBool, Ordering};

pub mod episode;
pub mod genre;
pub mod library;
pub mod media;
pub mod mediafile;
pub mod movie;
pub mod schema;
pub mod season;
pub mod streamablemedia;
pub mod tv;

lazy_static::lazy_static! {
    static ref MIGRATIONS_FLAG: AtomicBool = AtomicBool::new(false);
}

embed_migrations!("../../migrations");

pub fn run_migrations(
    conn: &diesel::PgConnection,
) -> Result<(), diesel_migrations::RunMigrationsError> {
    embedded_migrations::run(conn)
}

/// Function which returns a Result<T, E> where T is a new connection session or E is a connection
/// error.
///
/// # Example
/// ```
/// use dim_database::get_conn;
///
/// let conn = get_conn().unwrap(); // panics if connection failed.
/// ```
pub fn get_conn() -> Result<diesel::PgConnection, diesel::result::ConnectionError> {
    use diesel::connection::Connection;
    use diesel::pg::PgConnection;

    // This is the URL for the database inside a docker container
    let conn = PgConnection::establish("postgres://postgres:dimpostgres@postgres/dim");

    let conn = if conn.is_ok() {
        conn
    } else {
        // If we cant connect to the docker URL, assume we are not running inside docker and
        // connect to localhost instead.
        PgConnection::establish("postgres://postgres:dimpostgres@127.0.0.1/dim")
    }?;

    if !MIGRATIONS_FLAG.load(Ordering::SeqCst) {
        if run_migrations(&conn).is_ok() {
            MIGRATIONS_FLAG.store(true, Ordering::SeqCst);
        }
    }

    Ok(conn)
}
