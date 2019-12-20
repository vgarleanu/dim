use pushevent::SerializableEvent;
use serde::Serialize;
use std::collections::HashMap;

/// Struct encompasses a message we are trying to relay to a client from somehwere within dim. It
/// holds an id and a event_type field.
#[derive(Serialize)]
pub struct Message {
    /// Field id, can hold anything and the client usually discriminates its meaning based on the
    /// event_type. For example within dim, sometimes it can be the library_id or media_id or
    /// sometimes its just -1 meaning ignore
    pub id: i32,
    /// Field holds the event type that gets relayed to the clients.
    #[serde(flatten)]
    pub event_type: PushEventType,
}

/// Enum holds all event types used within dim that are dispatched over ws.
#[derive(Serialize)]
#[serde(tag = "type")]
pub enum PushEventType {
    /// A new media card has been added to the database
    EventNewCard,
    /// A card has been removed from the database
    EventRemoveCard,
    /// A new library has been added to the database
    EventNewLibrary,
    /// A library has been removed from the database
    EventRemoveLibrary,
    /// A stream is ready to be streamed.
    EventStreamIsReady,
    /// Holds a hashmap of stats collected from ffmpeg over stdout.
    EventStreamStats(HashMap<String, String>),
}

impl SerializableEvent for Message {
    /// Serialize method used as a intermediary to serialize the struct into a json string and
    /// return it.
    fn serialize(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}
