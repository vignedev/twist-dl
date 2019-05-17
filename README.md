# twist-dl
Simple twist.moe anime downloader

## Installation

Install it via npm as a global module
```bash
npm i twist-dl -g
```

## Usage

### Interactive CLI
```bash
$ twistmoe
```
Just type `twistmoe` to your terminal/cmd.

This will launch a simple interface that can be easily controlled via arrow keys, space and enter.

Anime list and sources are directly fetched from twist.moe. It will download into your currently working directory under the same filename as it is on their servers.

### With arguments
```
$ twistmoe -h
Usage: twistmoe -a <anime name> -e <episode> [-o <output>]

Options:

  -a, --anime       Name of the anime, can be partial
  -e, --episode     Which episode to download (1 = episode 1)
  -o, --output      Folder in which it'll be downloaded in, use - to output to stdout
```
#### Examples
```bash
$ twistmoe -a "yuyushiki" -e latest
$ twistmoe https://twist.moe/a/yuyushiki/12
```

## Disclaimer

`todo: disclaimer`

Long story short, it's for educational purposes only. If you like the program, please *donate to the Twist.Moe admins* so they can keep the servers up and running.

## License

MIT