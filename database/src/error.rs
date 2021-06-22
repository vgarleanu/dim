use err_derive::Error;

#[derive(Error, Debug)]
pub enum DatabaseError {
    #[error(display = "An error has occured")]
    DatabaseError(#[source] sqlx::error::Error),
}