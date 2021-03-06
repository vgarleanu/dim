use serde_derive::{Deserialize, Serialize};
use std::{path::PathBuf, process::Command, str};

#[derive(Default, Debug, Clone, PartialEq)]
pub struct FFPWrapper {
    ffpstream: Option<FFPStream>,
    corrupt: Option<bool>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
struct FFPStream {
    streams: Vec<Stream>,
    format: Format,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Stream {
    pub index: i64,
    pub codec_name: String,
    profile: Option<String>,
    codec_type: String,
    codec_time_base: Option<String>,
    pub width: Option<i64>,
    pub height: Option<i64>,
    coded_width: Option<i64>,
    coded_height: Option<i64>,
    display_aspect_ratio: Option<String>,
    is_avc: Option<String>,
    pub level: Option<i64>,
    pub tags: Option<Tags>,
    sample_rate: Option<String>,
    channels: Option<i64>,
    channel_layout: Option<String>,
    pub bit_rate: Option<String>,
    duration_ts: Option<i64>,
    duration: Option<String>,
    color_range: Option<String>,
    color_space: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Tags {
    pub language: Option<String>,
    pub title: Option<String>,
    #[serde(rename = "BPS-eng")]
    bps_eng: Option<String>,
    #[serde(rename = "DURATION-eng")]
    duration_eng: Option<String>,
    #[serde(rename = "NUMBER_OF_FRAMES-eng")]
    number_of_frames_eng: Option<String>,
    #[serde(rename = "_STATISTICS_WRITING_APP-eng")]
    statistics_writing_app_eng: Option<String>,
    #[serde(rename = "_STATISTICS_WRITING_DATE_UTC-eng")]
    statistics_writing_date_utc_eng: Option<String>,
    #[serde(rename = "_STATISTICS_TAGS-eng")]
    statistics_tags_eng: Option<String>,
    filename: Option<String>,
    mimetype: Option<String>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
struct Format {
    filename: String,
    nb_streams: i64,
    nb_programs: i64,
    format_name: String,
    format_long_name: String,
    start_time: String,
    duration: String,
    size: String,
    bit_rate: String,
}

pub struct FFProbeCtx {
    ffprobe_bin: String,
}

impl FFProbeCtx {
    pub fn new(ffprobe_bin: &'static str) -> Self {
        Self {
            ffprobe_bin: ffprobe_bin.to_owned(),
        }
    }

    pub fn get_meta(&self, file: &PathBuf) -> Result<FFPWrapper, std::io::Error> {
        let probe = Command::new(self.ffprobe_bin.clone())
            .arg(file.to_str().unwrap())
            .arg("-v")
            .arg("quiet")
            .arg("-print_format")
            .arg("json")
            .arg("-show_streams")
            .arg("-show_format")
            .output()?;

        let json = String::from_utf8_lossy(probe.stdout.as_slice());

        let de: FFPWrapper = serde_json::from_str(&json).map_or_else(
            |_| FFPWrapper {
                ffpstream: None,
                corrupt: Some(true),
            },
            |x| FFPWrapper {
                ffpstream: Some(x),
                corrupt: None,
            },
        );

        Ok(de)
    }
}

impl FFPWrapper {
    pub fn get_bitrate(&self) -> String {
        if let Some(ctx) = self.ffpstream.clone() {
            return ctx.format.bit_rate;
        }
        "0".into()
    }

    pub fn get_quality(&self) -> Option<String> {
        if let Some(ctx) = self.ffpstream.clone() {
            match ctx.streams[0].height {
                Some(x) => Some(x.to_string()),
                None => None,
            }
        } else {
            None
        }
    }

    pub fn get_codec(&self) -> Option<String> {
        if let Some(ctx) = self.ffpstream.clone() {
            Some(ctx.streams[0].codec_name.clone())
        } else {
            None
        }
    }

    pub fn get_container(&self) -> Option<String> {
        if let Some(ctx) = self.ffpstream.clone() {
            Some(ctx.format.format_name)
        } else {
            None
        }
    }

    pub fn get_audio_type(&self) -> Option<String> {
        if let Some(ctx) = self.ffpstream.clone() {
            ctx.streams.get(1).map(|x| x.codec_name.clone())
        } else {
            None
        }
    }

    pub fn get_res(&self) -> Option<String> {
        if let Some(ctx) = self.ffpstream.clone() {
            Some(format!(
                "{}x{}",
                ctx.streams[0].width.unwrap_or(1920),
                ctx.streams[0].height.unwrap_or(1080)
            ))
        } else {
            None
        }
    }

    pub fn get_duration(&self) -> Option<i32> {
        if let Some(ctx) = self.ffpstream.clone() {
            Some(ctx.format.duration.parse::<f64>().unwrap() as i32)
        } else {
            None
        }
    }

    pub fn get_ms(&self) -> Option<u128> {
        if let Some(ctx) = self.ffpstream.clone() {
            Some((ctx.format.duration.parse::<f64>().unwrap().trunc() * 1_000_000.0) as u128)
        } else {
            None
        }
    }

    pub fn is_corrupt(&self) -> Option<bool> {
        Some(self.corrupt.unwrap_or(false))
    }

    pub fn is_codec(&self, codec: &str) -> Option<bool> {
        Some(!self.find_by_codec(codec).is_empty())
    }

    pub fn find_by_codec(&self, codec: &str) -> Vec<&Stream> {
        if let Some(x) = self.ffpstream.as_ref() {
            x.streams
                .iter()
                .filter(|x| x.codec_type == codec.to_string())
                .collect()
        } else {
            Vec::new()
        }
    }
}
